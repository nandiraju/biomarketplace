import React from 'react';
import { 
  Dna, 
  Search, 
  Database, 
  Truck, 
  Wallet, 
  Users, 
  ShieldAlert,
  Home
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, loggedInLabId, setLoggedInLabId }) {
  const getProfileInfo = () => {
    switch (currentView) {
      case 'researcher':
        return { name: 'Dr. Sarah Jenkins', role: 'Lead Researcher', avatar: 'SJ' };
      case 'lab':
        if (loggedInLabId === 'dana-farber') {
          return { name: 'DFCI Coordinator', role: 'Dana-Farber Biobank', avatar: 'DF' };
        } else if (loggedInLabId === 'md-anderson') {
          return { name: 'MDAB Coordinator', role: 'MD Anderson Repository', avatar: 'MD' };
        } else if (loggedInLabId === 'mayo-clinic') {
          return { name: 'MCTH Coordinator', role: 'Mayo Clinic Tissue Hub', avatar: 'MC' };
        }
        return { name: 'Biobank Partner', role: 'Awaiting Auth Login', avatar: '🔑' };
      case 'tracker':
        return { name: 'BioExpress Logistics', role: 'Logistics Supervisor', avatar: 'BE' };
      case 'payment':
        return { name: 'Direct Auditor', role: 'Financial Admin', avatar: 'FA' };
      default:
        return { name: 'Dr. Sarah Jenkins', role: 'Lead Researcher', avatar: 'SJ' };
    }
  };

  const profile = getProfileInfo();

  return (
    <div className="sidebar">
      <div className="sidebar-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', marginBottom: '24px' }}>
        <img src="logo-light-text.png" alt="1Cell.Ai Logo" style={{ width: '100%', maxWidth: '200px', height: 'auto', display: 'block' }} />
        <div style={{ fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.05em', fontWeight: '700', textTransform: 'uppercase', paddingLeft: '2px', marginTop: '4px' }}>
          Federated Biobank System
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-header">WORKSPACE MODULES</div>
        
        <button 
          className={`menu-item ${currentView === 'landing' ? 'active' : ''}`}
          onClick={() => setCurrentView('landing')}
        >
          <Home size={18} />
          <span>Marketplace Home</span>
          <span className="role-badge" style={{ background: 'rgba(255,255,255,0.04)' }}>Home</span>
        </button>

        <button 
          className={`menu-item ${currentView === 'researcher' ? 'active' : ''}`}
          onClick={() => setCurrentView('researcher')}
        >
          <Search size={18} />
          <span>Researcher Portal</span>
          <span className="role-badge">Buyer</span>
        </button>

        <button 
          className={`menu-item ${currentView === 'lab' ? 'active' : ''}`}
          onClick={() => setCurrentView('lab')}
        >
          <Database size={18} />
          <span>Biobank Portal</span>
          <span className="role-badge" style={{ 
            background: loggedInLabId ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)', 
            color: loggedInLabId ? 'var(--accent-emerald)' : 'var(--accent-rose)' 
          }}>
            {loggedInLabId ? (loggedInLabId === 'dana-farber' ? 'DFCI' : loggedInLabId === 'md-anderson' ? 'MDAB' : 'MCTH') : 'Locked'}
          </span>
        </button>

        <button 
          className={`menu-item ${currentView === 'tracker' ? 'active' : ''}`}
          onClick={() => setCurrentView('tracker')}
        >
          <Truck size={18} />
          <span>iTracker System</span>
          <span className="role-badge">Logistics</span>
        </button>

        <button 
          className={`menu-item ${currentView === 'payment' ? 'active' : ''}`}
          onClick={() => setCurrentView('payment')}
        >
          <Wallet size={18} />
          <span>Ledger & Earnings</span>
          <span className="role-badge">Direct</span>
        </button>

        <div className="menu-header" style={{ marginTop: '24px' }}>System Integrations</div>
        
        <div className="menu-item" style={{ opacity: 0.7, cursor: 'default' }}>
          <Users size={16} />
          <span style={{ fontSize: '12px' }}>3 Downstream Labs</span>
        </div>
        <div className="menu-item" style={{ opacity: 0.7, cursor: 'default' }}>
          <ShieldAlert size={16} />
          <span style={{ fontSize: '12px' }}>Cold Chain Active</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{profile.avatar}</div>
          <div className="user-info">
            <span className="user-name">{profile.name}</span>
            <span className="user-role">{profile.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
