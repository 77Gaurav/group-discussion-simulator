import React, { useState } from 'react';
import { X, Key, CheckCircle, Save, Volume2 } from 'lucide-react';

export default function SettingsModal({ 
  status, 
  onClose, 
  onSaveSettings 
}) {
  const [groqKey, setGroqKey] = useState('');
  const [murfKey, setMurfKey] = useState('');
  const [sarvamKey, setSarvamKey] = useState('');
  const [groqModel, setGroqModel] = useState(status?.llmModel || 'openai/gpt-oss-120b');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSaveSettings({
      groqApiKey: groqKey.trim() || undefined,
      murfApiKey: murfKey.trim() || undefined,
      sarvamApiKey: sarvamKey.trim() || undefined,
      groqModel: groqModel.trim() || undefined
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.8)',
      backdropFilter: 'blur(12px)',
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        borderRadius: '20px',
        border: '1px solid var(--border-subtle)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Voice Engines & API Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Connection Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Active AI Engines
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
            <span>Groq AI (gpt-oss-120b + Whisper):</span>
            <span style={{ color: status?.groqConfigured ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              {status?.groqConfigured ? '● Configured (Active)' : '○ Missing'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
            <span>Murf AI TTS (Rohan, Priya, Arohi, Aarav):</span>
            <span style={{ color: status?.murfConfigured ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              {status?.murfConfigured ? '● Configured (Active)' : '○ Missing (Add below or in .env)'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
            <span>Sarvam AI TTS (Shubh, Shreya):</span>
            <span style={{ color: status?.sarvamConfigured ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              {status?.sarvamConfigured ? '● Configured (Active)' : '○ Missing (Add below or in .env)'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Volume2 size={14} color="#10b981" />
              <span>Murf API Key (Voices: Rohan, Priya, Arohi, Aarav)</span>
            </label>
            <input
              type="password"
              value={murfKey}
              onChange={(e) => setMurfKey(e.target.value)}
              placeholder={status?.murfConfigured ? '●●●●●●●● (Configured in .env)' : 'Enter MURF_API_KEY'}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Volume2 size={14} color="#f59e0b" />
              <span>Sarvam API Key (Voices: Shubh, Shreya)</span>
            </label>
            <input
              type="password"
              value={sarvamKey}
              onChange={(e) => setSarvamKey(e.target.value)}
              placeholder={status?.sarvamConfigured ? '●●●●●●●● (Configured in .env)' : 'Enter SARVAM_API_KEY'}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Groq LLM Model
              </label>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                ⚡ Fast Inference
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
              {[
                { id: 'qwen/qwen3.8-27b', label: 'Qwen 27B', speed: '~350ms (Ultra)' },
                { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B', speed: '~1s (Fast)' },
                { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', speed: '~4s (Deep)' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGroqModel(m.id)}
                  style={{
                    background: groqModel === m.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: groqModel === m.id ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    color: groqModel === m.id ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontWeight: groqModel === m.id ? 700 : 500 }}>{m.label}</span>
                  <span style={{ fontSize: '0.65rem', color: groqModel === m.id ? '#a5b4fc' : 'var(--text-dim)' }}>
                    {m.speed}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="text"
              value={groqModel}
              onChange={(e) => setGroqModel(e.target.value)}
              placeholder="e.g. qwen/qwen3.8-27b or openai/gpt-oss-20b"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Update Groq API Key (Optional)
            </label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder={status?.groqConfigured ? '●●●●●●●● (Configured in .env)' : 'Enter GROQ_API_KEY'}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle size={15} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
