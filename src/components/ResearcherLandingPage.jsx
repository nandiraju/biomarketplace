import React from 'react';
import { Search, Database, Truck, Wallet, ShieldCheck, ArrowRight, Dna, ArrowLeft } from 'lucide-react';

export default function ResearcherLandingPage({ onStart, onBackToGateway }) {
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
        background: 'radial-gradient(circle, rgba(32, 153, 232, 0.08) 0%, rgba(255,255,255,0) 70%)',
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
        background: 'radial-gradient(circle, rgba(218, 165, 32, 0.06) 0%, rgba(255,255,255,0) 70%)',
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
            <ShieldCheck size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>Sponsor Workspace Active</span>
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
            background: 'rgba(32, 153, 232, 0.08)',
            border: '1px solid rgba(32, 153, 232, 0.15)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--accent-indigo)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '24px'
          }}>
            <Search size={14} /> Researcher Portal
          </div>

          <h1 style={{
            fontSize: '44px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            marginBottom: '20px'
          }}>
            Configure Cohort Inquiries & <span style={{
              background: 'linear-gradient(90deg, var(--accent-indigo) 0%, var(--accent-teal) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Settle Payments Directly</span>
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
            Define precise clinical criteria for cancer stage, tissue type, and demographics. 
            Receive transparent price quotes from certified clinical biobanks, select the best match, 
            and transfer funds directly to initiate cryo-storage inventory fulfillment.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onStart}
              className="btn btn-primary"
              style={{
                fontSize: '16px',
                padding: '16px 40px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(32, 153, 232, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              Start your biobank request <ArrowRight size={18} />
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Interactive mock workspace. Fully loaded with pre-configured cohort and tracker events.
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
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(32, 153, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', marginBottom: '8px' }}>
              <Search size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>1. Publish Inquiry</strong>
          </div>
          <div style={{ height: '2px', flexGrow: 1, background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-teal))', opacity: 0.3, margin: '0 10px' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(32, 153, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', marginBottom: '8px' }}>
              <Database size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>2. Compare Quotes</strong>
          </div>
          <div style={{ height: '2px', flexGrow: 1, background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-emerald))', opacity: 0.3, margin: '0 10px' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(32, 153, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', marginBottom: '8px' }}>
              <Wallet size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>3. Pay Direct</strong>
          </div>
          <div style={{ height: '2px', flexGrow: 1, background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-gold))', opacity: 0.3, margin: '0 10px' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
              <Truck size={20} />
            </div>
            <strong style={{ fontSize: '12px' }}>4. Track Logistics</strong>
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
            <div style={{ background: 'rgba(32, 153, 232, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', marginBottom: '16px' }}>
              <Search size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Cohort Specifications</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Publish cohort inquiries with detailed demographic tags and specimen types to matching repository nodes.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(32, 153, 232, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', marginBottom: '16px' }}>
              <Database size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Estimate Comparison</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Compare fulfillable sample counts, lead times, and price quotes submitted by clinical biobank core partners.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(32, 153, 232, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', marginBottom: '16px' }}>
              <Wallet size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Direct Settlement</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Accept price quotes and authorize immediate, direct payments to Biobanks via your sandbox wallet.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(32, 153, 232, 0.06)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', marginBottom: '16px' }}>
              <Truck size={18} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>iTracker Telemetry</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Monitor real-time dry ice temperature monitoring and shipment location tracking for secured biological packages.
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
