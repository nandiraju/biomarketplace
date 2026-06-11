import React from 'react';
import { Database, Search, ShieldCheck, ArrowRight, Dna, ArrowLeft, Layers, Activity, Truck } from 'lucide-react';

export default function BiobankLandingPage({ onStart, onBackToGateway }) {
  return (
    <div className="landing-wrapper" style={{
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
      {/* Decorative background grid and blurs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(255,255,255,0) 70%)',
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
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Top Navbar */}
        <header style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '60px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(26, 54, 93, 0.06)'
        }}>
          <button 
            onClick={onBackToGateway}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.03)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <ArrowLeft size={16} /> Return to Gateway
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(26, 54, 93, 0.05)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--text-secondary)'
          }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Supplier Node Active</span>
          </div>
        </header>

        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          maxWidth: '850px',
          marginBottom: '50px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--accent-emerald)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '24px'
          }}>
            <Database size={14} /> Biobank Partner Workspace
          </div>

          <h1 style={{
            fontSize: '44px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            marginBottom: '20px'
          }}>
            Monetize Biosample Catalogs & <span style={{
              background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-indigo) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Submit Direct Estimates</span>
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '36px',
            maxWidth: '750px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            View cohort requests published by sponsor institutions. Match inquiries against local LIMS physical catalogs, 
            submit custom price quotes, allocate available specimens upon direct payment receipt, and initialize shipping tracking.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onStart}
              className="btn btn-primary"
              style={{
                fontSize: '16px',
                padding: '16px 40px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-indigo) 100%)',
                border: 'none',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              Access Biobank Core Portal <ArrowRight size={18} />
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Authorized Biobank node coordinator credentials required for physical specimen access.
            </span>
          </div>
        </div>

        {/* Workflow Diagram Preview */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '900px',
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-light)',
          padding: '24px 40px',
          borderRadius: '20px',
          marginBottom: '60px',
          boxShadow: 'var(--shadow-glass)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
              <Layers size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>1. View Inquiries</strong>
          </div>
          <div style={{ height: '2px', flexGrow: 1, background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-indigo))', opacity: 0.3, margin: '0 10px' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
              <Activity size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>2. Submit Quote</strong>
          </div>
          <div style={{ height: '2px', flexGrow: 1, background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-teal))', opacity: 0.3, margin: '0 10px' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
              <Database size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>3. Allocate LIMS</strong>
          </div>
          <div style={{ height: '2px', flexGrow: 1, background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-emerald))', opacity: 0.3, margin: '0 10px' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
              <Truck size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>4. Ship Cold-Chain</strong>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          width: '100%',
          marginBottom: '40px'
        }}>
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '16px' }}>
              <Database size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>LIMS Integration</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Sync local cryo-freezers and room cabinets directly with the marketplace core. Match specimens in real-time.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '16px' }}>
              <Activity size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Quoting Engine</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Review criteria and post competitive price estimates with lead times, RIN quality notes, and specimen capacity limits.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '16px' }}>
              <Layers size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Direct Earnings</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Receive direct wallet-to-wallet transfers upon quote acceptance. Zero escrow delay; immediately start specimen packing.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '16px' }}>
              <Truck size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>iTracker Dispatch</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Generate shipping labels, barcode specimens, and log cold-chain temperature telemetry parameters to the iTracker hub.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '60px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          width: '100%',
          borderTop: '1px solid rgba(26, 54, 93, 0.06)',
          paddingTop: '20px'
        }}>
          © 2026 iCore Biobank Systems. Sourced under 1Cell.Ai clinical guidelines.
        </footer>
      </div>
    </div>
  );
}
