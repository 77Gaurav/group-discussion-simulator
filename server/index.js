import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { PERSONAS, AI_PARTICIPANT_IDS } from './personas.js';
import { GD_TOPICS } from './topics.js';

// Resolve directory and environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env from current dir or parent dir
const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Configure multer for audio uploads (in-memory buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Cache for generated TTS audio bytes (hash -> Buffer)
const ttsAudioCache = new Map();

// Active GD sessions map (sessionId -> sessionData)
const sessions = new Map();

// Helper: Reload env from disk if updated
function reloadEnvFile() {
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (val) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (_e) {
    // ignore
  }
}

// Helper: Get Groq API Key
function getGroqKey() {
  if (!process.env.GROQ_API_KEY) reloadEnvFile();
  return process.env.GROQ_API_KEY || '';
}

// Helper: Get Murf API Key (for Rohan, Priya, Arohi, Aarav)
function getMurfKey() {
  if (!process.env.MURF_API_KEY) reloadEnvFile();
  return process.env.MURF_API_KEY || '';
}

// Helper: Get Sarvam API Key (for Shubh, Shreya)
function getSarvamKey() {
  if (!process.env.SARVAM_API_KEY) reloadEnvFile();
  return process.env.SARVAM_API_KEY || '';
}

// Helper: Get ElevenLabs API Key (optional fallback)
function getElevenLabsKey() {
  if (!process.env.ELEVENLABS_API_KEY) reloadEnvFile();
  return process.env.ELEVENLABS_API_KEY || '';
}

// Helper: Get Groq LLM Model (Defaults to ultra-fast qwen/qwen3.8-27b)
function getGroqModel() {
  reloadEnvFile();
  return process.env.GROQ_LLM_MODEL || 'qwen/qwen3.8-27b';
}

// Murf AI TTS Synthesis (for Rohan, Priya, Arohi, Aarav)
async function generateMurfTTS(text, voiceId, apiKey) {
  const cleanVoice = voiceId || 'en-IN-aarav';
  const resp = await fetch('https://api.murf.ai/v1/speech/generate', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      text: text.trim(),
      voiceId: cleanVoice,
      format: 'MP3',
      encodeAsBase64: true
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Murf API error (${resp.status}): ${errText}`);
  }

  const data = await resp.json();
  if (data.encodedAudio) {
    return Buffer.from(data.encodedAudio, 'base64');
  } else if (data.audioFile) {
    const audioResp = await fetch(data.audioFile);
    if (!audioResp.ok) throw new Error(`Failed to fetch audio from Murf file URL: ${data.audioFile}`);
    return Buffer.from(await audioResp.arrayBuffer());
  } else {
    throw new Error('Murf API returned neither encodedAudio nor audioFile URL');
  }
}

// Sarvam AI TTS Synthesis (for Shubh, Shreya)
async function generateSarvamTTS(text, speaker, apiKey) {
  const cleanSpeaker = (speaker || 'shreya').toLowerCase();

  // Try standard Bulbul v3 request
  let resp = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: [text.trim()],
      target_language_code: 'en-IN',
      speaker: cleanSpeaker,
      model: 'bulbul:v3',
      enable_preprocessing: true
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.warn(`Sarvam bulbul:v3 returned ${resp.status}: ${errText}. Retrying with default payload...`);
    // Retry with fallback payload without model parameter
    resp = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: [text.trim()],
        target_language_code: 'en-IN',
        speaker: cleanSpeaker
      })
    });

    if (!resp.ok) {
      const retryErr = await resp.text();
      throw new Error(`Sarvam API error (${resp.status}): ${retryErr || errText}`);
    }
  }

  const data = await resp.json();
  if (data.audios && data.audios[0]) {
    return Buffer.from(data.audios[0], 'base64');
  }
  throw new Error('Sarvam API returned empty audios array');
}

// Helper: Call Groq Chat Completions with automatic fallback
async function callGroqLLM(messages, temperature = 0.7, maxTokens = 1200) {
  const apiKey = getGroqKey();
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const primaryModel = getGroqModel();
  const candidateModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b'];
  const modelsToTry = [primaryModel, ...candidateModels.filter(m => m !== primaryModel)];

  let lastError = null;
  for (const model of modelsToTry) {
    try {
      // Non-reasoning models like Qwen 27B don't need excessive headroom
      const isReasoningModel = model.includes('120b') || model.includes('20b');
      const tokenLimit = isReasoningModel 
        ? Math.max(maxTokens || 1200, 1000) 
        : Math.min(maxTokens || 400, 800);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: tokenLimit
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Groq error with model ${model}:`, errorText);
        lastError = new Error(`Groq API Error (${response.status}): ${errorText}`);
        continue;
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const content = choice?.message?.content?.trim() || '';

      if (content) {
        return { content, modelUsed: model, reasoning: choice?.message?.reasoning || null };
      }
    } catch (err) {
      console.error(`Error calling Groq model ${model}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate response from Groq API');
}

// ==========================================
// ROUTES
// ==========================================

// Health and Status Check
app.get('/api/gd/status', (req, res) => {
  const groqKey = getGroqKey();
  const murfKey = getMurfKey();
  const sarvamKey = getSarvamKey();
  const elevenKey = getElevenLabsKey();

  res.json({
    status: 'online',
    groqConfigured: Boolean(groqKey && groqKey.startsWith('gsk_')),
    murfConfigured: Boolean(murfKey && murfKey.trim().length > 5),
    sarvamConfigured: Boolean(sarvamKey && sarvamKey.trim().length > 5),
    elevenLabsConfigured: Boolean(elevenKey && elevenKey.trim().length > 10),
    llmModel: getGroqModel(),
    sttModel: 'whisper-large-v3-turbo',
    ttsEngines: {
      murf: {
        configured: Boolean(murfKey && murfKey.trim().length > 5),
        voices: ['Rohan', 'Priya', 'Arohi', 'Aarav']
      },
      sarvam: {
        configured: Boolean(sarvamKey && sarvamKey.trim().length > 5),
        voices: ['Shubh', 'Shreya']
      }
    },
    totalTopics: GD_TOPICS.length,
    participantsCount: Object.keys(PERSONAS).length
  });
});

// Get Preloaded GD Topics & Personas
app.get('/api/gd/topics', (req, res) => {
  res.json({
    topics: GD_TOPICS,
    personas: PERSONAS
  });
});

// Start New GD Session
app.post('/api/gd/start', async (req, res) => {
  try {
    const { topicId, customTopic, studentName = 'Candidate' } = req.body;

    let selectedTopic = null;
    if (topicId === 'custom' && customTopic) {
      selectedTopic = {
        id: 'custom_' + Date.now(),
        title: customTopic.title,
        category: customTopic.category || 'General Placement Topic',
        difficulty: customTopic.difficulty || 'Medium',
        overview: customTopic.overview || 'Open group discussion on this candidate-provided topic.',
        starterQuestions: customTopic.starterQuestions || ['What are the core technical trade-offs of this approach?'],
        keyAngles: {
          aarav: 'Operational complexity, network latency, and deployment bottlenecks.',
          priya: 'Benchmark metrics, empirical performance, and throughput constraints.',
          rohan: 'Engineering velocity, time to market, and product ROI.',
          arohi: 'Developer ergonomics, systemic architecture, and ethical implications.',
          shubh: 'Security vulnerability surfaces and edge-case failure modes.'
        }
      };
    } else if (topicId === 'random' || !topicId) {
      // Blind draw from the 15 confidential topics
      const randomIndex = Math.floor(Math.random() * GD_TOPICS.length);
      selectedTopic = GD_TOPICS[randomIndex];
    } else {
      selectedTopic = GD_TOPICS.find(t => t.id === topicId) || GD_TOPICS[0];
    }

    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Initialize session state
    const session = {
      id: sessionId,
      topic: selectedTopic,
      studentName: studentName.trim() || 'Candidate',
      phase: 'introduction', // introduction -> open_discussion -> conclusion -> completed
      round: 1,
      startTime: Date.now(),
      transcript: [],
      turnsTaken: {
        moderator: 0,
        aarav: 0,
        priya: 0,
        rohan: 0,
        arohi: 0,
        shubh: 0,
        student: 0
      },
      speakerQueue: []
    };

    sessions.set(sessionId, session);

    // Generate Moderator Welcome & Opening Statement in Indian Professional English
    const moderatorPrompt = [
      {
        role: 'system',
        content: `You are Shreya, Director of Engineering and experienced Group Discussion (GD) Moderator for premier Indian campus placement drives (IITs, NITs, top tech employers).
You are welcoming 6 participants: 5 engineering candidates (${PERSONAS.aarav.name}, ${PERSONAS.priya.name}, ${PERSONAS.rohan.name}, ${PERSONAS.arohi.name}, ${PERSONAS.shubh.name}) and 1 student candidate named "${session.studentName}".

TODAY'S RANDOMLY DRAWN TOPIC: "${selectedTopic.title}"
CATEGORY: "${selectedTopic.category}"
CONTEXT & OVERVIEW: ${selectedTopic.overview}

INSTRUCTIONS FOR OPENING STATEMENT:
1. Speak in fluent, authoritative, and polite Indian professional English (as spoken in top tech hiring GDs).
2. Welcome the group warmly to today's campus recruitment GD as Moderator Shreya.
3. Announce today's randomly drawn topic clearly: "${selectedTopic.title}".
4. Note that this topic was drawn from our 15-question engineering placement bank to test analytical thinking and spontaneous articulation.
5. Establish ground rules: encourage constructive debate, listening, backing arguments with technical rationale, and respecting everyone's speaking time.
6. Formally invite the candidates to open the floor, explicitly welcoming "${session.studentName}" and the group to share their opening perspectives.
7. Keep it punchy, engaging, and professional (between 75 to 110 words). Do NOT use bullet points, formatting, or markdown headings; speak naturally as an audio transcript.`
      },
      {
        role: 'user',
        content: 'Please deliver the opening address for this group discussion.'
      }
    ];

    const modResult = await callGroqLLM(moderatorPrompt, 0.7, 300);
    const modSpeech = modResult.content;

    const openingMessage = {
      id: 'msg_0',
      speakerId: 'moderator',
      speakerName: PERSONAS.moderator.name,
      speakerRole: PERSONAS.moderator.role,
      badge: PERSONAS.moderator.badge,
      color: PERSONAS.moderator.color,
      avatar: PERSONAS.moderator.avatar,
      text: modSpeech,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      phase: 'introduction'
    };

    session.transcript.push(openingMessage);
    session.turnsTaken.moderator += 1;

    res.json({
      sessionId,
      session,
      openingMessage
    });
  } catch (err) {
    console.error('Error starting GD session:', err);
    res.status(500).json({ error: err.message || 'Failed to start GD session' });
  }
});

// Take Next Turn (AI Participant speaks or Moderator interjects)
app.post('/api/gd/turn', async (req, res) => {
  try {
    const { sessionId, requestedSpeakerId = null, phase = null } = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found. Please start a session first.' });
    }

    if (phase) {
      session.phase = phase;
    }

    // Determine who speaks next
    let nextSpeakerId = requestedSpeakerId;

    if (!nextSpeakerId || nextSpeakerId === 'auto') {
      const recentSpeakers = session.transcript.slice(-3).map(m => m.speakerId);
      const lastSpeaker = recentSpeakers[recentSpeakers.length - 1];

      // Eligible speakers: those who didn't speak just now
      const eligiblePeers = AI_PARTICIPANT_IDS.filter(id => id !== lastSpeaker);

      // Prioritize peers who have spoken fewer times
      eligiblePeers.sort((a, b) => (session.turnsTaken[a] || 0) - (session.turnsTaken[b] || 0));

      // After every 4-5 peer exchanges, let the moderator synthesize or guide
      const totalTurns = session.transcript.length;
      const modTurns = session.turnsTaken.moderator || 0;
      if (totalTurns > 4 && totalTurns % 5 === 0 && modTurns < totalTurns / 4) {
        nextSpeakerId = 'moderator';
      } else {
        // Pick among the least-spoken peers with slight randomization
        const topCandidates = eligiblePeers.slice(0, 2);
        nextSpeakerId = topCandidates[Math.floor(Math.random() * topCandidates.length)] || eligiblePeers[0];
      }
    }

    const speakerInfo = PERSONAS[nextSpeakerId];
    if (!speakerInfo) {
      return res.status(400).json({ error: `Speaker ID ${nextSpeakerId} not found.` });
    }

    // Prepare context from recent transcript (last 6 messages)
    const recentTranscript = session.transcript.slice(-6)
      .map(m => `${m.speakerName} (${m.badge}): "${m.text}"`)
      .join('\n\n');

    let systemPrompt = '';
    let userPrompt = '';

    if (nextSpeakerId === 'moderator') {
      systemPrompt = `You are Shreya, the expert GD Moderator.
TOPIC: "${session.topic.title}"
STUDENT CANDIDATE NAME: "${session.studentName}"
CURRENT PHASE: ${session.phase}

YOUR GOAL:
Guide the GD constructively. You notice the flow of conversation.
- If ${session.studentName} has not spoken recently, warmly invite them into the discussion by referencing a recent point made by one of the participants.
- If participants are debating strongly, synthesize the two sides and ask a probing forward-looking question.
- If it's time to conclude, invite final closing thoughts from everyone.
- Keep your statement crisp, natural, authoritative, and encouraging (between 45 to 80 words). Do NOT use bullet points or formatting. Speak directly in fluent Indian professional English.`;

      userPrompt = `Here is the recent conversation in the GD:\n\n${recentTranscript}\n\nPlease step in naturally as Moderator Shreya to guide the discussion.`;
    } else {
      // It's one of the 5 AI participants (Aarav, Priya, Rohan, Arohi, Shubh)
      const otherPersonasDesc = Object.values(PERSONAS)
        .filter(p => p.id !== nextSpeakerId)
        .map(p => `- ${p.name} (${p.badge}): ${p.style}`)
        .join('\n');

      systemPrompt = `You are ${speakerInfo.name}, participating in an active Group Discussion (GD) for engineering campus placements.
YOUR ROLE / BADGE: ${speakerInfo.badge}
YOUR PERSONA & STYLE: ${speakerInfo.style}
YOUR PERSPECTIVE EMPHASIS: ${speakerInfo.description}

TOPIC: "${session.topic.title}"
TOPIC OVERVIEW: ${session.topic.overview}
KEY ANGLE FOR YOUR PROFILE: ${session.topic.keyAngles?.[nextSpeakerId] || ''}

OTHER PARTICIPANTS IN ROOM:
${otherPersonasDesc}
- ${session.studentName} (Engineering Candidate / Real Student)

CONVERSATIONAL GD GUIDELINES:
1. Speak in articulate, fluent Indian professional English (as spoken in top tech placement interviews and IIT/NIT GDs).
2. Speak in a completely natural, human, conversational cadence (50 to 85 words).
3. Directly reference the previous speaker by name or build upon their point (e.g., "I agree with Aarav regarding latency bottlenecks, but...", "Priya brings up an important telemetry metric, however...", "To ${session.studentName}'s point earlier...").
4. Speak from your distinctive persona: bring your unique engineering, business, ethical, or analytical perspective.
5. Keep the debate engaging and collaborative—do NOT give long lectures, numbered lists, or markdown formatting. Speak directly as if you are seated around a GD round-table.`;

      userPrompt = `The latest exchanges in the GD room are:\n\n${recentTranscript}\n\nNow, as ${speakerInfo.name}, take your turn to speak and contribute your perspective to the circle.`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const result = await callGroqLLM(messages, 0.75, 400);
    const spokenText = result.content;

    const message = {
      id: 'msg_' + session.transcript.length,
      speakerId: nextSpeakerId,
      speakerName: speakerInfo.name,
      speakerRole: speakerInfo.role,
      badge: speakerInfo.badge,
      color: speakerInfo.color,
      avatar: speakerInfo.avatar,
      text: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      phase: session.phase
    };

    session.transcript.push(message);
    session.turnsTaken[nextSpeakerId] = (session.turnsTaken[nextSpeakerId] || 0) + 1;

    res.json({
      message,
      session: {
        id: session.id,
        phase: session.phase,
        turnsTaken: session.turnsTaken,
        totalMessages: session.transcript.length
      }
    });
  } catch (err) {
    console.error('Error generating GD turn:', err);
    res.status(500).json({ error: err.message || 'Failed to generate GD turn' });
  }
});

// Student Speaks (Post student text or speech into the transcript)
app.post('/api/gd/student-speak', (req, res) => {
  try {
    const { sessionId, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const studentInfo = PERSONAS.student;
    const message = {
      id: 'msg_' + session.transcript.length,
      speakerId: 'student',
      speakerName: session.studentName || studentInfo.name,
      speakerRole: studentInfo.role,
      badge: studentInfo.badge,
      color: studentInfo.color,
      avatar: studentInfo.avatar,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      phase: session.phase
    };

    session.transcript.push(message);
    session.turnsTaken.student = (session.turnsTaken.student || 0) + 1;

    res.json({
      message,
      session: {
        id: session.id,
        turnsTaken: session.turnsTaken,
        totalMessages: session.transcript.length
      }
    });
  } catch (err) {
    console.error('Error adding student speech:', err);
    res.status(500).json({ error: err.message || 'Failed to add student speech' });
  }
});

// Speech-to-Text via Groq Whisper Turbo (<300ms latency)
app.post('/api/gd/stt', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Audio file is required.' });
    }

    const apiKey = getGroqKey();
    if (!apiKey) {
      return res.status(400).json({ error: 'GROQ_API_KEY is missing.' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'audio.webm',
      contentType: req.file.mimetype || 'audio/webm'
    });
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', 'en');
    formData.append('response_format', 'json');

    const groqResp = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!groqResp.ok) {
      const errText = await groqResp.text();
      console.error('Groq Whisper error:', errText);
      return res.status(groqResp.status).json({ error: `Groq STT failed: ${errText}` });
    }

    const data = await groqResp.json();
    const transcribedText = (data.text || '').trim();

    res.json({
      text: transcribedText
    });
  } catch (err) {
    console.error('Error during STT:', err);
    res.status(500).json({ error: err.message || 'STT transcription failed' });
  }
});

// Text-to-Speech via Murf API {Rohan, Priya, Arohi, Aarav} and Sarvam API {Shubh, Shreya}
app.post('/api/gd/tts', async (req, res) => {
  try {
    const { text, speakerId, voiceId: overrideVoiceId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const persona = PERSONAS[speakerId] || PERSONAS.moderator;
    const provider = persona.provider || (speakerId === 'moderator' || speakerId === 'shubh' ? 'sarvam' : 'murf');
    const voiceId = overrideVoiceId || persona.voiceId || (provider === 'sarvam' ? 'shreya' : 'en-IN-aarav');

    // Check memory cache
    const cacheKey = crypto.createHash('md5').update(`${provider}:${voiceId}:${text.trim()}`).digest('hex');
    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', cached.length);
      res.setHeader('X-Audio-Cache', 'HIT');
      res.setHeader('X-TTS-Provider', provider);
      return res.send(cached);
    }

    let audioBuffer = null;

    if (provider === 'sarvam') {
      // Sarvam API for Shubh, Shreya
      const sarvamKey = getSarvamKey();
      if (!sarvamKey) {
        return res.status(400).json({
          error: `SARVAM_API_KEY is not configured for ${persona.name} (${voiceId}). Please set SARVAM_API_KEY in Settings or your .env file.`
        });
      }
      audioBuffer = await generateSarvamTTS(text, voiceId, sarvamKey);
    } else {
      // Murf API for Rohan, Priya, Arohi, Aarav
      const murfKey = getMurfKey();
      if (!murfKey) {
        return res.status(400).json({
          error: `MURF_API_KEY is not configured for ${persona.name} (${voiceId}). Please set MURF_API_KEY in Settings or your .env file.`
        });
      }
      audioBuffer = await generateMurfTTS(text, voiceId, murfKey);
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(500).json({ error: `Audio generation produced empty audio for ${persona.name}.` });
    }

    // Cache the buffer (keep cache up to 200 items to avoid memory explosion)
    if (ttsAudioCache.size > 200) {
      const firstKey = ttsAudioCache.keys().next().value;
      ttsAudioCache.delete(firstKey);
    }
    ttsAudioCache.set(cacheKey, audioBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('X-Audio-Cache', 'MISS');
    res.setHeader('X-TTS-Provider', provider);
    res.send(audioBuffer);
  } catch (err) {
    console.error('Error during TTS synthesis:', err);
    res.status(500).json({ error: err.message || 'TTS generation failed' });
  }
});

// Comprehensive Post-GD Placement Evaluation & Scorecard
app.post('/api/gd/evaluate', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const fullTranscript = session.transcript
      .map(m => `[${m.timestamp}] ${m.speakerName} (${m.badge}): ${m.text}`)
      .join('\n\n');

    const studentTurns = session.transcript.filter(m => m.speakerId === 'student');
    const studentWordCount = studentTurns.reduce((acc, m) => acc + m.text.split(/\s+/).length, 0);

    const evaluationPrompt = [
      {
        role: 'system',
        content: `You are an expert GD Assessor and Senior Technical Hiring Panelist evaluating candidates for top tech companies (FAANG, tier-1 product startups).
You are evaluating the real human candidate named "${session.studentName}".

GD TOPIC: "${session.topic.title}"
CANDIDATE STATS:
- Total turns spoken by candidate: ${studentTurns.length}
- Total words spoken: ${studentWordCount}
- Total discussion messages: ${session.transcript.length}

You must evaluate "${session.studentName}" strictly based on their actual contributions in the transcript.

EVALUATION CRITERIA (Score 0 to 10 for each):
1. articulation: Speech clarity, grammatical structure, conciseness, and persuasiveness.
2. technicalDepth: Use of engineering fundamentals, architectural reasoning, trade-offs, and metrics.
3. activeListening: Directly referencing peer points, acknowledging valid ideas, and building upon existing discussions.
4. counterArguments: Ability to respectfully challenge flawed assumptions, offer edge-case failure examples, and hold ground politely.
5. leadership: Guiding discussion towards constructive conclusions, mediating disagreements, and helping quiet peers.

OUTPUT FORMAT:
Respond with ONLY a valid, parseable JSON object matching this exact schema:
{
  "overallScore": 8.2,
  "percentile": 87,
  "verdict": "STRONG HIRE" | "HIRE" | "LEANING HIRE" | "NEEDS IMPROVEMENT",
  "summary": "2-3 sentence executive evaluation summary",
  "scores": {
    "articulation": 8,
    "technicalDepth": 9,
    "activeListening": 7,
    "counterArguments": 8,
    "leadership": 7
  },
  "strengths": [
    "Specific observation with direct reference to their speech",
    "Another notable strength"
  ],
  "areasForImprovement": [
    "Specific constructive critique",
    "Another area for growth"
  ],
  "actionableTips": [
    "Actionable practice exercise or technique for future campus placement rounds"
  ]
}`
      },
      {
        role: 'user',
        content: `Here is the full verbatim transcript of the Group Discussion session:\n\n${fullTranscript}\n\nPlease evaluate candidate "${session.studentName}".`
      }
    ];

    const result = await callGroqLLM(evaluationPrompt, 0.4, 900);
    let evalJson = null;

    try {
      // Clean potential markdown tags if returned
      let cleanText = result.content.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      evalJson = JSON.parse(cleanText);
    } catch (parseErr) {
      console.warn('Failed to parse evaluation JSON directly, extracting substring:', parseErr.message);
      const match = result.content.match(/\{[\s\S]*\}/);
      if (match) {
        evalJson = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse evaluation scorecard response.');
      }
    }

    session.phase = 'completed';
    session.evaluation = evalJson;

    res.json({
      evaluation: evalJson,
      stats: {
        totalTurns: session.transcript.length,
        studentTurns: studentTurns.length,
        studentWordCount,
        durationMinutes: Math.round((Date.now() - session.startTime) / 60000)
      }
    });
  } catch (err) {
    console.error('Error generating evaluation:', err);
    res.status(500).json({ error: err.message || 'Failed to generate evaluation' });
  }
});

// Update Keys from UI Settings if changed
app.post('/api/gd/settings', (req, res) => {
  const { groqApiKey, murfApiKey, sarvamApiKey, elevenLabsApiKey, groqModel } = req.body;
  if (groqApiKey && groqApiKey.trim()) {
    process.env.GROQ_API_KEY = groqApiKey.trim();
  }
  if (murfApiKey && murfApiKey.trim()) {
    process.env.MURF_API_KEY = murfApiKey.trim();
  }
  if (sarvamApiKey && sarvamApiKey.trim()) {
    process.env.SARVAM_API_KEY = sarvamApiKey.trim();
  }
  if (elevenLabsApiKey && elevenLabsApiKey.trim()) {
    process.env.ELEVENLABS_API_KEY = elevenLabsApiKey.trim();
  }
  if (groqModel && groqModel.trim()) {
    process.env.GROQ_LLM_MODEL = groqModel.trim();
  }

  res.json({
    success: true,
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    murfConfigured: Boolean(process.env.MURF_API_KEY),
    sarvamConfigured: Boolean(process.env.SARVAM_API_KEY),
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
    llmModel: process.env.GROQ_LLM_MODEL || 'openai/gpt-oss-120b'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI GD Platform Server running on http://localhost:${PORT}`);
  console.log(`   Groq Model: ${getGroqModel()}`);
  console.log(`   Groq Whisper STT: whisper-large-v3-turbo`);
  console.log(`   Murf API TTS: Rohan, Priya, Arohi, Aarav`);
  console.log(`   Sarvam API TTS: Shubh, Shreya`);
  console.log(`   Question Bank: ${GD_TOPICS.length} placement topics`);
});
