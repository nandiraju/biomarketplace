import React from 'react';
import { 
  Search, 
  Database, 
  Truck, 
  Wallet, 
  ShieldAlert,
  Home,
  LogOut
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  loggedInLabId, 
  setLoggedInLabId, 
  role, 
  setRole 
}) {
  const getProfileInfo = () => {
    if (role === 'researcher') {
      return { name: 'Dr. Sarah Jenkins', role: 'Lead Researcher', avatar: 'SJ' };
    } else if (role === 'biobank') {
      if (loggedInLabId === 'dana-farber') {
        return { name: 'DFCI Coordinator', role: 'Dana-Farber Biobank', avatar: 'DF' };
      } else if (loggedInLabId === 'md-anderson') {
        return { name: 'MDAB Coordinator', role: 'MD Anderson Repository', avatar: 'MD' };
      } else if (loggedInLabId === 'mayo-clinic') {
        return { name: 'MCTH Coordinator', role: 'Mayo Clinic Tissue Hub', avatar: 'MC' };
      }
      return { name: 'Biobank Partner', role: 'LIMS Node Staff', avatar: '🔑' };
    }
    return { name: 'Dr. Sarah Jenkins', role: 'Lead Researcher', avatar: 'SJ' };
  };

  const profile = getProfileInfo();

  const handleReturnToGateway = () => {
    setLoggedInLabId(null);
    setRole(null);
    setCurrentView('landing');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', marginBottom: '24px' }}>
        <img src="logo-light-text.png" alt="1Cell.Ai Logo" style={{ width: '100%', maxWidth: '200px', height: 'auto', display: 'block' }} />
        <div style={{ fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.05em', fontWeight: '700', textTransform: 'uppercase', paddingLeft: '2px', marginTop: '4px' }}>
          {role === 'researcher' ? 'Researcher Portal' : 'Biobank LIMS Core'}
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-header">WORKSPACE MODULES</div>
        
        {/* Gateway Home */}
        <button 
          className="menu-item"
          onClick={handleReturnToGateway}
        >
          <Home size={18} />
          <span>Exit to Gateway</span>
          <span className="role-badge" style={{ background: 'rgba(255,255,255,0.04)' }}>Home</span>
        </button>

        {role === 'researcher' && (
          <>
            {/* Researcher Dashboard */}
            <button 
              className={`menu-item ${currentView === 'researcher' || currentView === 'researcher_landing' ? 'active' : ''}`}
              onClick={() => setCurrentView('researcher')}
            >
              <Search size={18} />
              <span>Cohort Inquiries</span>
              <span className="role-badge">Sponsor</span>
            </button>

            {/* iTracker Logistics */}
            <button 
              className={`menu-item ${currentView === 'tracker' ? 'active' : ''}`}
              onClick={() => setCurrentView('tracker')}
            >
              <Truck size={18} />
              <span>iTracker Logistics</span>
              <span className="role-badge">Track</span>
            </button>

            {/* Wallet & Ledger */}
            <button 
              className={`menu-item ${currentView === 'payment' ? 'active' : ''}`}
              onClick={() => setCurrentView('payment')}
            >
              <Wallet size={18} />
              <span>Sponsor Ledger</span>
              <span className="role-badge">Wallet</span>
            </button>
          </>
        )}

        {role === 'biobank' && (
          <>
            {/* Biobank Portal */}
            <button 
              className={`menu-item ${currentView === 'lab' || currentView === 'biobank_landing' ? 'active' : ''}`}
              onClick={() => setCurrentView('lab')}
            >
              <Database size={18} />
              <span>LIMS Core Node</span>
              <span className="role-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                {loggedInLabId === 'dana-farber' ? 'DFCI' : loggedInLabId === 'md-anderson' ? 'MDAB' : loggedInLabId === 'mayo-clinic' ? 'MCTH' : 'Node'}
              </span>
            </button>

            {/* iTracker Shipments */}
            <button 
              className={`menu-item ${currentView === 'tracker' ? 'active' : ''}`}
              onClick={() => setCurrentView('tracker')}
            >
              <Truck size={18} />
              <span>Specimen Shipments</span>
              <span className="role-badge">Courier</span>
            </button>

            {/* Ledger & Earnings */}
            <button 
              className={`menu-item ${currentView === 'payment' ? 'active' : ''}`}
              onClick={() => setCurrentView('payment')}
            >
              <Wallet size={18} />
              <span>Partner Earnings</span>
              <span className="role-badge">Earnings</span>
            </button>
          </>
        )}

        <div className="menu-header" style={{ marginTop: '24px' }}>System Integrations</div>
        
        <div className="menu-item" style={{ opacity: 0.7, cursor: 'default' }}>
          <ShieldAlert size={16} />
          <span style={{ fontSize: '12px' }}>Cold Chain Active</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="user-avatar">{profile.avatar}</div>
            <div className="user-info">
              <span className="user-name" style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>{profile.name}</span>
              <span className="user-role" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{profile.role}</span>
            </div>
          </div>
          {role === 'biobank' && loggedInLabId && (
            <button 
              onClick={() => { setLoggedInLabId(null); setCurrentView('lab'); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-rose)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              title="Log Out Node"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
