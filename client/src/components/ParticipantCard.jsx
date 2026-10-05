import React from 'react';
import { Hand } from 'lucide-react';

export default function ParticipantCard({
  participant,
  isSpeaking,
  isStudent = false,
  isHandRaised = false,
  turnCount = 0,
  onRaiseHandToggle = null
}) {
  if (!participant) return null;

  const borderColor = isSpeaking ? (participant.color || '#6366f1') : 'var(--border-subtle)';
  const glow = isSpeaking ? `0 0 25px ${participant.glowColor || 'rgba(99, 102, 241, 0.4)'}` : 'none';

  return (
    <div
      className={`glass-panel ${isSpeaking ? 'glass-panel-active' : ''}`}
      style={{
        position: 'relative',
        padding: '18px 20px',
        borderRadius: '16px',
        border: `1.5px solid ${borderColor}`,
        boxShadow: glow,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
        minHeight: '175px',
        background: isSpeaking ? 'rgba(26, 35, 54, 0.9)' : 'var(--bg-card)'
      }}
    >
      {/* Top row: Avatar & Status Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar circle with speaking halo */}
          <div
            className={isSpeaking ? 'speaking-pulse' : ''}
            style={{
              '--speaker-glow': participant.glowColor || 'rgba(99, 102, 241, 0.7)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(15, 20, 32, 0.9)',
              border: `2.5px solid ${participant.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: isSpeaking ? `0 0 15px ${participant.color}` : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {participant.avatar}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                {participant.name}
              </h4>
              {isStudent && (
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: '#38bdf8',
                  color: '#07090e',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  textTransform: 'uppercase'
                }}>
                  You
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: participant.color
              }}>
                {participant.badge}
              </span>
              {participant.engine && (
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: participant.provider === 'sarvam' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: participant.provider === 'sarvam' ? '#fbbf24' : '#34d399',
                  fontWeight: 600
                }}>
                  {participant.engine}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Turn count badge */}
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3px 8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>{turnCount} {turnCount === 1 ? 'turn' : 'turns'}</span>
        </div>
      </div>

      {/* Description / Role snippet */}
      <p style={{
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: 1.45,
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {participant.role || participant.description}
      </p>

      {/* Bottom Status / Speaking Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.74rem'
      }}>
        {isSpeaking ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: participant.color, fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
              <div className="wave-bar" style={{ color: participant.color }} />
              <div className="wave-bar" style={{ color: participant.color }} />
              <div className="wave-bar" style={{ color: participant.color }} />
              <div className="wave-bar" style={{ color: participant.color }} />
              <div className="wave-bar" style={{ color: participant.color }} />
            </div>
            <span>Speaking now...</span>
          </div>
        ) : isHandRaised ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 600 }}>
            <Hand size={14} />
            <span>Hand Raised to Speak</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)' }} />
            <span>Listening</span>
          </div>
        )}

        {isStudent && onRaiseHandToggle && (
          <button
            onClick={onRaiseHandToggle}
            style={{
              background: isHandRaised ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isHandRaised ? '#f59e0b' : 'var(--border-subtle)'}`,
              color: isHandRaised ? '#fbbf24' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem'
            }}
          >
            <Hand size={12} />
            <span>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
