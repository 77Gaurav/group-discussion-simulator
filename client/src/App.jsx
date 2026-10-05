import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TopicSelector from './components/TopicSelector';
import GDRoom from './components/GDRoom';
import EvaluationModal from './components/EvaluationModal';
import SettingsModal from './components/SettingsModal';
import { DEFAULT_TOPICS, DEFAULT_PERSONAS } from './data/defaultData';

export default function App() {
  const [status, setStatus] = useState(null);
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);
  const [currentView, setCurrentView] = useState('selector'); // 'selector' | 'room'

  // Session state
  const [session, setSession] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [isGeneratingScorecard, setIsGeneratingScorecard] = useState(false);

  // Scorecard modal state
  const [evaluation, setEvaluation] = useState(null);
  const [evaluationStats, setEvaluationStats] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Audio & MediaRecorder refs
  const audioPlayerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const autoTurnTimeoutRef = useRef(null);
  const activeSessionRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/gd/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn('Could not fetch status:', err);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/gd/topics');
      if (res.ok) {
        const data = await res.json();
        setTopics(data.topics || DEFAULT_TOPICS);
        setPersonas(data.personas || DEFAULT_PERSONAS);
      }
    } catch (err) {
      console.warn('Could not fetch topics:', err);
    }
  };

  // Keep activeSessionRef in sync
  useEffect(() => {
    activeSessionRef.current = session;
  }, [session]);

  // Load status and topics on mount
  useEffect(() => {
    fetchStatus();
    fetchTopics();
  }, []);

  // Timer effect when in room view
  useEffect(() => {
    let timer = null;
    if (currentView === 'room' && session) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentView, session]);

  // Play audio for a speech message via ElevenLabs Multilingual V2 TTS
  const playSpeakerAudio = async (message) => {
    if (!message || message.speakerId === 'student') return;

    try {
      // Stop any existing playback
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }

      setActiveSpeakerId(message.speakerId);
      setIsAudioPlaying(true);

      const res = await fetch('/api/gd/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message.text,
          speakerId: message.speakerId
        })
      });

      if (!res.ok) {
        console.warn('TTS request failed or ElevenLabs key missing, continuing visually');
        setIsAudioPlaying(false);
        setActiveSpeakerId(null);
        handlePostSpeechPause();
        return;
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setIsAudioPlaying(false);
        setActiveSpeakerId(null);
        URL.revokeObjectURL(audioUrl);

        // Natural pause before considering next turn
        handlePostSpeechPause();
      };

      audio.onerror = (err) => {
        console.warn('Audio playback error:', err);
        setIsAudioPlaying(false);
        setActiveSpeakerId(null);
        handlePostSpeechPause();
      };

      await audio.play();
    } catch (err) {
      console.error('Error playing TTS audio:', err);
      setIsAudioPlaying(false);
      setActiveSpeakerId(null);
      handlePostSpeechPause();
    }
  };

  // Post speech natural pause: after an AI speaks, can auto-trigger next turn after a pause
  const handlePostSpeechPause = () => {
    if (autoTurnTimeoutRef.current) {
      clearTimeout(autoTurnTimeoutRef.current);
    }

    // Schedule next turn if session is active and student is not currently recording
    autoTurnTimeoutRef.current = setTimeout(() => {
      if (activeSessionRef.current && !isRecordingMic && currentView === 'room') {
        // Automatically keep discussion going with a moderate pace
        handleNextTurn('auto');
      }
    }, 2800); // 2.8s natural thinking gap between turns
  };

  // Start GD Session
  const handleStartSession = async ({ topicId, customTopic, studentName }) => {
    setIsProcessingTurn(true);
    try {
      const res = await fetch('/api/gd/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, customTopic, studentName })
      });

      if (!res.ok) {
        throw new Error('Failed to initialize GD session');
      }

      const data = await res.json();
      setSession(data.session);
      setTranscript([data.openingMessage]);
      setElapsedSeconds(0);
      setCurrentView('room');

      // Play Moderator opening speech
      if (data.openingMessage) {
        playSpeakerAudio(data.openingMessage);
      }
    } catch (err) {
      console.error('Failed to start session:', err);
      alert('Could not start GD session: ' + err.message);
    } finally {
      setIsProcessingTurn(false);
    }
  };

  // Trigger Next Turn (AI Participant speaks)
  const handleNextTurn = async (requestedSpeakerId = 'auto') => {
    if (!session || isProcessingTurn) return;

    if (autoTurnTimeoutRef.current) {
      clearTimeout(autoTurnTimeoutRef.current);
    }

    setIsProcessingTurn(true);
    try {
      const res = await fetch('/api/gd/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          requestedSpeakerId
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate turn');
      }

      const data = await res.json();
      setSession(prev => ({
        ...prev,
        ...data.session
      }));
      setTranscript(prev => [...prev, data.message]);

      // Play audio of the spoken message
      if (data.message) {
        playSpeakerAudio(data.message);
      }
    } catch (err) {
      console.error('Error in next turn:', err);
    } finally {
      setIsProcessingTurn(false);
    }
  };

  // Student Submits Text Input
  const handleSubmitStudentText = async (text) => {
    if (!session || !text.trim()) return;

    if (autoTurnTimeoutRef.current) {
      clearTimeout(autoTurnTimeoutRef.current);
    }

    setIsProcessingTurn(true);
    try {
      const res = await fetch('/api/gd/student-speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          text: text.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to record student turn');
      }

      const data = await res.json();
      setSession(prev => ({
        ...prev,
        ...data.session
      }));
      setTranscript(prev => [...prev, data.message]);

      // Highlight student as having spoken
      setActiveSpeakerId('student');
      setTimeout(() => {
        setActiveSpeakerId(null);
        // Prompt next AI to respond to student!
        handleNextTurn('auto');
      }, 1200);
    } catch (err) {
      console.error('Error submitting student speech:', err);
    } finally {
      setIsProcessingTurn(false);
    }
  };

  // Start Microphone Recording
  const handleStartRecording = async () => {
    if (isAudioPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsAudioPlaying(false);
    }

    if (autoTurnTimeoutRef.current) {
      clearTimeout(autoTurnTimeoutRef.current);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await processStudentAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecordingMic(true);
      setActiveSpeakerId('student');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please grant browser microphone permission or use the text input.');
    }
  };

  // Stop Microphone Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecordingMic) {
      mediaRecorderRef.current.stop();
      setIsRecordingMic(false);
    }
  };

  // Process Student Audio Blob via Groq Whisper Large V3 Turbo STT
  const processStudentAudio = async (audioBlob) => {
    setIsProcessingTurn(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'student_voice.webm');

      const res = await fetch('/api/gd/stt', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('STT transcription error');
      }

      const data = await res.json();
      const transcribedText = data.text?.trim();

      if (transcribedText) {
        // Submit the transcribed speech to the GD room
        await handleSubmitStudentText(transcribedText);
      } else {
        console.warn('No speech detected in audio');
      }
    } catch (err) {
      console.error('Error during STT processing:', err);
      alert('Whisper transcription failed: ' + err.message);
    } finally {
      setIsProcessingTurn(false);
      setActiveSpeakerId(null);
    }
  };

  // End Session & Generate Placement Evaluation Scorecard
  const handleEndSession = async () => {
    if (!session || isGeneratingScorecard) return;

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (autoTurnTimeoutRef.current) {
      clearTimeout(autoTurnTimeoutRef.current);
    }

    setIsGeneratingScorecard(true);
    try {
      const res = await fetch('/api/gd/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id })
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate GD');
      }

      const data = await res.json();
      setEvaluation(data.evaluation);
      setEvaluationStats(data.stats);
      setShowEvaluationModal(true);
    } catch (err) {
      console.error('Error evaluating session:', err);
      alert('Could not generate evaluation: ' + err.message);
    } finally {
      setIsGeneratingScorecard(false);
    }
  };

  const handleSaveSettings = async (settings) => {
    try {
      const res = await fetch('/api/gd/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(prev => ({
          ...prev,
          groqConfigured: data.groqConfigured,
          elevenLabsConfigured: data.elevenLabsConfigured,
          llmModel: data.llmModel
        }));
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleRestart = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (autoTurnTimeoutRef.current) {
      clearTimeout(autoTurnTimeoutRef.current);
    }
    setShowEvaluationModal(false);
    setSession(null);
    setTranscript([]);
    setEvaluation(null);
    setCurrentView('selector');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        session={session}
        elapsedTime={elapsedSeconds}
        onOpenSettings={() => setShowSettingsModal(true)}
        status={status}
      />

      <main style={{ flex: 1 }}>
        {currentView === 'selector' ? (
          <TopicSelector
            topics={topics}
            personas={personas}
            onStartSession={handleStartSession}
            isLoading={isProcessingTurn}
          />
        ) : (
          session && (
            <GDRoom
              session={session}
              personas={personas}
              transcript={transcript}
              activeSpeakerId={activeSpeakerId}
              isAudioPlaying={isAudioPlaying}
              isRecordingMic={isRecordingMic}
              isProcessingTurn={isProcessingTurn}
              isGeneratingScorecard={isGeneratingScorecard}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onSubmitStudentText={handleSubmitStudentText}
              onNextTurn={handleNextTurn}
              onEndSession={handleEndSession}
              onPlayMessageAudio={playSpeakerAudio}
            />
          )
        )}
      </main>

      {/* Evaluation Scorecard Modal */}
      {showEvaluationModal && (
        <EvaluationModal
          evaluation={evaluation}
          stats={evaluationStats}
          topic={session?.topic}
          candidateName={session?.studentName || 'Candidate'}
          onClose={() => setShowEvaluationModal(false)}
          onRestart={handleRestart}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          status={status}
          onClose={() => setShowSettingsModal(false)}
          onSaveSettings={handleSaveSettings}
        />
      )}
    </div>
  );
}
