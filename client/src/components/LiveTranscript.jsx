import React, { useEffect, useRef } from 'react';
import { Volume2, MessageSquare, Sparkles } from 'lucide-react';

export default function LiveTranscript({
  transcript = [],
  activeSpeakerId = null,
  onPlayAudio = null
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(15, 20, 32, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="#818cf8" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>
            Live Discussion Feed
          </h3>
        </div>
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2px 8px',
          borderRadius: '10px'
        }}>
          {transcript.length} {transcript.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Messages list */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {transcript.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-dim)',
            textAlign: 'center',
            gap: '8px',
            padding: '20px'
          }}>
            <Sparkles size={28} color="#6366f1" style={{ opacity: 0.5 }} />
            <p style={{ fontSize: '0.86rem' }}>Discussion is about to commence. Opening remarks will appear here.</p>
          </div>
        ) : (
          transcript.map((msg, idx) => {
            const isLatest = idx === transcript.length - 1;
            const isSpeakerActive = activeSpeakerId === msg.speakerId && isLatest;

            return (
              <div
                key={msg.id || idx}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isSpeakerActive 
                    ? 'rgba(99, 102, 241, 0.12)' 
                    : msg.speakerId === 'student' 
                      ? 'rgba(56, 189, 248, 0.08)' 
                      : 'rgba(255, 255, 255, 0.02)',
                  border: isSpeakerActive 
                    ? `1px solid ${msg.color || '#6366f1'}` 
                    : '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Speaker Avatar */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(20, 27, 43, 0.9)',
                  border: `2px solid ${msg.color || 'var(--primary)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}>
                  {msg.avatar || '💬'}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                        {msg.speakerName}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: msg.color || '#818cf8',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {msg.badge}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        {msg.timestamp}
                      </span>
                      {onPlayAudio && msg.speakerId !== 'student' && (
                        <button
                          onClick={() => onPlayAudio(msg)}
                          title="Replay Audio"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                        >
                          <Volume2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.5,
                    margin: 0,
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
