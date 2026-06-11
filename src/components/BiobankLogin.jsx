import React, { useState } from 'react';
import { MOCK_LABS } from '../data/mockData';
import { ShieldCheck, Database, ArrowLeft, Key } from 'lucide-react';

export default function BiobankLogin({ onLogin, onBackToGateway }) {
  const [loginFormLabId, setLoginFormLabId] = useState('dana-farber');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginFormLabId);
  };

  const selectedLab = MOCK_LABS.find(l => l.id === loginFormLabId) || MOCK_LABS[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      fontFamily: "'Poppins', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      color: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        zIndex: 1
      }}>
        {/* Back Link */}
        <button 
          onClick={onBackToGateway}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '24px',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
          onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
        >
          <ArrowLeft size={16} /> Return to Gateway
        </button>

        {/* Login Form Container */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '40px 30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 50px rgba(16, 185, 129, 0.05)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-emerald)',
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Database size={28} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Biobank Core Auth
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
              Connect coordinator node to the physical LIMS inventory.
            </p>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            
            {/* Biobank Selector */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Core Laboratory Node
              </label>
              <select 
                className="form-select" 
                value={loginFormLabId}
                onChange={(e) => setLoginFormLabId(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f8fafc',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {MOCK_LABS.map(lab => (
                  <option key={lab.id} value={lab.id}>{lab.name} ({lab.code})</option>
                ))}
              </select>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Secure Access Passcode / Token
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required
                  style={{
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
                <Key size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', display: 'block' }}>
                Note: Sandbox node allows any password to access.
              </span>
            </div>

          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '13px', 
              fontWeight: '600',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-indigo) 100%)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} /> Authenticate Node Node
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#64748b',
          marginTop: '30px'
        }}>
          iCore LIMS Interface Core • 1Cell.Ai Compliant Node
        </p>
      </div>
    </div>
  );
}
