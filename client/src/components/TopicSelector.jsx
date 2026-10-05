import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle, 
  Users, 
  Zap,
  User,
  AlertCircle
} from 'lucide-react';

export default function TopicSelector({ 
  personas, 
  onStartSession, 
  isLoading 
}) {
  const [candidateName, setCandidateName] = useState('');
  const [targetTrack, setTargetTrack] = useState('Software Engineering / Systems');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const isNameValid = candidateName.trim().length > 0;

  const handleStart = () => {
    setHasAttemptedSubmit(true);
    if (!isNameValid) {
      return;
    }

    onStartSession({
      topicId: 'random', // Blind draw from the 15 confidential topics
      studentName: candidateName.trim()
    });
  };

  const TRACKS = [
    'Software Engineering / Systems',
    'Backend & Cloud Infrastructure',
    'AI & Applied Machine Learning',
    'Full-Stack Product Engineering'
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '36px'
    }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '24px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '16px'
        }}>
          <Sparkles size={16} color="#818cf8" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#c7d2fe' }}>
            Campus Recruitment & Tech Interview GD Simulator
          </span>
        </div>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '16px',
          letterSpacing: '-0.03em'
        }}>
          Master Group Discussions Against <br />
          <span className="text-gradient">5 Ultra-Realistic AI Engineering Peers</span>
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Experience authentic campus recruitment pressure.
          Practice speaking in <strong>Indian Professional English</strong> powered by 
          <strong> Murf AI</strong> ({'{'}Rohan, Priya, Arohi, Aarav{'}'}) and 
          <strong> Sarvam AI</strong> ({'{'}Shubh, Shreya{'}'}), 
          moderated live by Senior Director <strong>Shreya</strong>.
        </p>
      </div>

      {/* Main Grid: Left Candidate Setup, Right Secret Draw Briefing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 460px) 1fr', gap: '28px' }}>
        
        {/* Left Column: Candidate Registration & Peer Roster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Candidate Profile Box */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '2px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                <User size={22} color="#38bdf8" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  Candidate Registration
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Enter your name to register for the GD
                </span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: isNameValid ? '#38bdf8' : '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Your Full Name / Username *
                </label>
                {isNameValid && (
                  <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Ready
                  </span>
                )}
              </div>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Type your name here (e.g. Rahul, Sneha, Gaurav...)"
                autoFocus
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: (!isNameValid && hasAttemptedSubmit) 
                    ? '2px solid #ef4444' 
                    : isNameValid 
                      ? '1px solid #38bdf8' 
                      : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
              />
              {!isNameValid && hasAttemptedSubmit && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#ef4444', fontSize: '0.76rem' }}>
                  <AlertCircle size={13} />
                  <span>Please enter your name before entering the arena.</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Target Engineering Role
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TRACKS.map(track => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setTargetTrack(track)}
                    style={{
                      textAlign: 'left',
                      background: targetTrack === track ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      border: targetTrack === track ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: targetTrack === track ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.82rem',
                      fontWeight: targetTrack === track ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{track}</span>
                    {targetTrack === track && <CheckCircle size={14} color="#818cf8" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Room Peer Circle */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="#818cf8" />
                Roundtable Peers & Moderator
              </span>
              <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '10px' }}>
                6 Active Voices
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {personas && Object.values(personas).filter(p => p && p.id !== 'student').map((p) => (
                <div 
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(15, 20, 32, 0.9)',
                    border: `2px solid ${p.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    {p.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                          {p.name}
                        </span>
                        <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '8px', background: `${p.color}22`, color: p.color, fontWeight: 600 }}>
                          {p.badge}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '1px 6px', 
                        borderRadius: '6px', 
                        background: p.provider === 'sarvam' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: p.provider === 'sarvam' ? '#fbbf24' : '#34d399',
                        fontWeight: 600
                      }}>
                        {p.engine || (p.provider === 'sarvam' ? 'Sarvam AI' : 'Murf AI')}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Confidential Topic Draw Briefing & Entry Gate */}
        <div className="glass-panel" style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: '20px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.12) 0%, rgba(18, 24, 38, 0.95) 60%)',
          gap: '28px'
        }}>
          <div>
            {/* Top Secret Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <Lock size={13} />
                Confidential Placement Topic Draw
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                15 Curated Topics
              </span>
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '14px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              Topic Kept Strictly Confidential Until Floor Opens
            </h3>

            <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '24px' }}>
              In genuine campus placement recruitment drives (Google, Amazon, Microsoft, TCS Digital, Goldman Sachs), 
              candidates are never given the luxury of choosing or previewing topics in advance. 
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '14px',
              padding: '18px 20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px'
            }}>
              <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#38bdf8" />
                How This GD Simulation Works:
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ fontSize: '0.86rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>1.</span>
                  <span><strong>Random Draw:</strong> When you enter, the server draws 1 random topic from our 15 hardcoded engineering placement bank.</span>
                </li>
                <li style={{ fontSize: '0.86rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>2.</span>
                  <span><strong>Live Moderator Announcement:</strong> Senior Director Shreya announces the topic live over audio in Indian Professional English.</span>
                </li>
                <li style={{ fontSize: '0.86rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>3.</span>
                  <span><strong>Natural Turn Taking:</strong> 5 AI peers debate from diverse angles (latency, security, MLOps, ethics, business ROI). Use your microphone or text to interject.</span>
                </li>
                <li style={{ fontSize: '0.86rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>4.</span>
                  <span><strong>Recruiter Scorecard:</strong> Receive detailed scores on Articulation, Technical Depth, Active Listening, Counter-Arguments, and Leadership.</span>
                </li>
              </ul>
            </div>

            {/* Feature Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>🗣️ Murf AI Voices</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>Rohan, Priya, Arohi, Aarav (en-IN)</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>🎙️ Sarvam AI Voices</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>Shubh, Shreya (Bulbul Indian English)</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>⚡ Groq 120B AI</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>Sub-second reasoning with authentic engineering depth</div>
              </div>
            </div>
          </div>

          {/* Action Launch Bar */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                Candidate: <strong style={{ color: isNameValid ? '#38bdf8' : 'var(--text-dim)' }}>{candidateName.trim() || 'Please enter name above'}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Target Track: {targetTrack}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={isLoading || !isNameValid}
              className="btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1.05rem',
                borderRadius: '14px',
                gap: '10px',
                opacity: (!isNameValid && !isLoading) ? 0.6 : 1,
                cursor: (!isNameValid && !isLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              <span>
                {isLoading 
                  ? 'Drawing Topic & Entering...' 
                  : !isNameValid 
                    ? 'Enter Your Name to Enter Arena' 
                    : 'Enter GD Arena & Draw Topic'}
              </span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
