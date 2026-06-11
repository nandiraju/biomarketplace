import React from 'react';
import { Search, Database, ShieldCheck, ArrowRight, Dna } from 'lucide-react';

export default function LandingPage({ onSelectResearcher, onSelectBiobank }) {
  return (
    <div className="gateway-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
      fontFamily: "'Poppins', sans-serif",
      color: 'var(--text-primary)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background blurs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(32, 153, 232, 0.06) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '45vw',
        height: '45vw',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '1000px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Top Header */}
        <header style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '50px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <img src="logo-dark-text.png" alt="1Cell.Ai Logo" style={{ height: '52px', width: 'auto' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(26, 54, 93, 0.05)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginTop: '8px'
            }}>
              <ShieldCheck size={12} style={{ color: 'var(--accent-teal)' }} />
              <span>Federated Clinical Biobank Node Selector</span>
            </div>
          </div>
        </header>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '10px'
          }}>
            Select Your Marketplace Entry Point
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Access specialized workflows based on your clinical organization role.
          </p>
        </div>

        {/* Split Cards Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          width: '100%',
          marginBottom: '50px'
        }}>
          {/* Researcher Path Card */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '40px 30px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-glass)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={onSelectResearcher}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-indigo)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(32, 153, 232, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glass)';
            }}
          >
            <div style={{ 
              background: 'rgba(32, 153, 232, 0.08)', 
              width: '56px', 
              height: '56px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-indigo)', 
              marginBottom: '24px' 
            }}>
              <Search size={26} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Sponsor & Researcher Portal
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px', flexGrow: 1 }}>
              For clinical study leads, pharmacologists, and research sponsors. Configure custom cohort queries, evaluate price estimates, make direct payments to labs, and track cold-chain delivery telemetry.
            </p>

            <button 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '13px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px' 
              }}
            >
              Enter Sponsor Portal <ArrowRight size={16} />
            </button>
          </div>

          {/* Biobank Path Card */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '40px 30px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-glass)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={onSelectBiobank}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-emerald)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glass)';
            }}
          >
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.08)', 
              width: '56px', 
              height: '56px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-emerald)', 
              marginBottom: '24px' 
            }}>
              <Database size={26} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Biobank Partner Portal
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px', flexGrow: 1 }}>
              For biorepository coordinators and pathology core technicians. View active cohort inquiries, query local freezer inventories, submit custom price estimates, barcode physical samples, and ship.
            </p>

            <button 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '13px', 
                borderRadius: '8px', 
                background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-indigo) 100%)',
                border: 'none',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px' 
              }}
            >
              Enter Biobank Portal <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          width: '100%',
          borderTop: '1px solid rgba(26, 54, 93, 0.06)',
          paddingTop: '20px'
        }}>
          iCore Biosample Network • Sourced under 1Cell.Ai clinical guidelines.
        </footer>
      </div>
    </div>
  );
}
