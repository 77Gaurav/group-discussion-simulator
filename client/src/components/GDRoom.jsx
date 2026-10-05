import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Hand, 
  SkipForward, 
  Award,
  Sparkles
} from 'lucide-react';
import ParticipantCard from './ParticipantCard';
import LiveTranscript from './LiveTranscript';
import AudioVisualizer from './AudioVisualizer';

export default function GDRoom({
  session,
  personas,
  transcript,
  activeSpeakerId,
  isAudioPlaying,
  isRecordingMic,
  isProcessingTurn,
  isGeneratingScorecard,
  onStartRecording,
  onStopRecording,
  onSubmitStudentText,
  onNextTurn,
  onEndSession,
  onPlayMessageAudio
}) {
  const [inputText, setInputText] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);

  const activeSpeaker = personas?.[activeSpeakerId] || (activeSpeakerId === 'student' ? personas?.student : null);

  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessingTurn) return;
    onSubmitStudentText(inputText.trim());
    setInputText('');
    setIsHandRaised(false);
  };

  // Group participants
  const moderator = personas?.moderator;
  const student = personas?.student;
  const aiCandidates = personas 
    ? Object.values(personas).filter(p => p && p.id !== 'moderator' && p.id !== 'student') 
    : [];

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '20px 24px 100px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Top Banner: GD Topic & Phase Indicator */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderLeft: '4px solid #6366f1'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              textTransform: 'uppercase'
            }}>
              Topic
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
              {session?.topic?.category || 'General'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            {session?.topic?.title || 'Group Discussion'}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Phase Badge */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ textTransform: 'capitalize' }}>
              Phase: {session.phase.replace('_', ' ')}
            </span>
          </div>

          {/* End & Evaluate Button */}
          <button
            onClick={onEndSession}
            disabled={isGeneratingScorecard || transcript.length < 2}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '8px 16px',
              fontSize: '0.85rem'
            }}
          >
            <Award size={16} />
            <span>{isGeneratingScorecard ? 'Evaluating GD...' : 'Finish & Get Scorecard'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Discussion Circle on Left, Live Transcript on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left: Interactive GD Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Central Active Speaker Audio Display Bar */}
          <div className="glass-panel" style={{
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: activeSpeaker ? `radial-gradient(ellipse at center, ${activeSpeaker.glowColor || 'rgba(99, 102, 241, 0.15)'} 0%, rgba(13, 18, 29, 0.9) 70%)` : 'var(--bg-card)',
            border: activeSpeaker ? `1px solid ${activeSpeaker.color}` : '1px solid var(--border-subtle)',
            borderRadius: '16px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>
                  {activeSpeaker?.avatar || '🎙️'}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
                      {activeSpeaker ? `${activeSpeaker.name}` : 'Discussion Floor Open'}
                    </span>
                    {activeSpeaker && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: activeSpeaker.color,
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {activeSpeaker.badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {isAudioPlaying 
                      ? 'Speaking in real-time with Cartesia TTS...' 
                      : isRecordingMic 
                        ? 'Recording your voice via Whisper Turbo...' 
                        : isProcessingTurn 
                          ? 'AI is formulating response...' 
                          : 'Floor is open — raise hand or speak!'}
                  </span>
                </div>
              </div>

              {/* Dynamic status pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isProcessingTurn && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    color: '#818cf8',
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}>
                    <Sparkles size={13} className="spin-slow" />
                    <span>Groq 120B reasoning...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Canvas Audio Waveform Visualizer */}
            <div style={{ marginTop: '4px' }}>
              <AudioVisualizer 
                isSpeaking={isAudioPlaying || isRecordingMic} 
                speakerColor={activeSpeaker?.color || '#38bdf8'} 
                height={32}
              />
            </div>
          </div>

          {/* Moderator Podium (Dr. Sunita Rao) */}
          {moderator && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <ParticipantCard
                participant={moderator}
                isSpeaking={activeSpeakerId === 'moderator'}
                turnCount={session.turnsTaken.moderator || 0}
              />
            </div>
          )}

          {/* 5 AI Engineering Candidates + Student Card Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px'
          }}>
            {/* Student Candidate Card (You) */}
            {student && (
              <ParticipantCard
                participant={{
                  ...student,
                  name: session.studentName || student.name
                }}
                isSpeaking={activeSpeakerId === 'student' || isRecordingMic}
                isStudent={true}
                isHandRaised={isHandRaised}
                turnCount={session.turnsTaken.student || 0}
                onRaiseHandToggle={() => setIsHandRaised(!isHandRaised)}
              />
            )}

            {/* 5 AI Challenger Cards */}
            {aiCandidates.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isSpeaking={activeSpeakerId === participant.id}
                turnCount={session.turnsTaken[participant.id] || 0}
              />
            ))}
          </div>
        </div>

        {/* Right: Live Transcript Feed */}
        <div style={{ height: 'calc(100vh - 180px)', position: 'sticky', top: '90px' }}>
          <LiveTranscript
            transcript={transcript}
            activeSpeakerId={activeSpeakerId}
            onPlayAudio={onPlayMessageAudio}
          />
        </div>
      </div>

      {/* Floating Bottom Control Bar for Student */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '960px',
        background: 'rgba(13, 18, 29, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '12px 20px',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Mic Button: Hold / Click to Speak */}
        <button
          onClick={isRecordingMic ? onStopRecording : onStartRecording}
          disabled={isProcessingTurn}
          className={isRecordingMic ? 'mic-recording-pulse' : ''}
          style={{
            background: isRecordingMic 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
              : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            boxShadow: isRecordingMic 
              ? '0 0 25px rgba(239, 68, 68, 0.6)' 
              : '0 4px 15px rgba(56, 189, 248, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          {isRecordingMic ? (
            <>
              <MicOff size={18} />
              <span>Done Speaking (Send)</span>
            </>
          ) : (
            <>
              <Mic size={18} />
              <span>Speak with Mic</span>
            </>
          )}
        </button>

        {/* Text Input Fallback */}
        <form 
          onSubmit={handleSendText}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '4px 6px 4px 14px'
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecordingMic || isProcessingTurn}
            placeholder={isRecordingMic ? 'Listening to your voice...' : 'Or type your counter-argument or perspective here...'}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isRecordingMic || isProcessingTurn}
            className="btn-primary"
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem'
            }}
          >
            <Send size={14} />
            <span>Send</span>
          </button>
        </form>

        {/* Hand-Raise Action */}
        <button
          onClick={() => setIsHandRaised(!isHandRaised)}
          title="Raise hand to signal you wish to speak next"
          style={{
            background: isHandRaised ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isHandRaised ? '#f59e0b' : 'var(--border-subtle)'}`,
            color: isHandRaised ? '#fbbf24' : 'var(--text-muted)',
            borderRadius: '12px',
            padding: '12px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            flexShrink: 0
          }}
        >
          <Hand size={16} />
          <span style={{ display: 'none', smDisplay: 'inline' }}>
            {isHandRaised ? 'Hand Up' : 'Raise Hand'}
          </span>
        </button>

        {/* Next AI Turn Trigger */}
        <button
          onClick={() => onNextTurn(isHandRaised ? 'student' : 'auto')}
          disabled={isProcessingTurn || isRecordingMic || isAudioPlaying}
          title="Prompt the next participant to take the floor"
          className="btn-secondary"
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            flexShrink: 0
          }}
        >
          <SkipForward size={16} />
          <span>Next Speaker</span>
        </button>
      </div>
    </div>
  );
}
