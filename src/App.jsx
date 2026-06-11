import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import ResearcherLandingPage from './components/ResearcherLandingPage';
import ResearcherDashboard from './components/ResearcherDashboard';
import ResearcherTracker from './components/ResearcherTracker';
import ResearcherPaymentHub from './components/ResearcherPaymentHub';
import { INITIAL_REQUESTS, INITIAL_SHIPMENTS } from './data/mockData';
import { HelpCircle, Network, Layers, ShieldCheck, RotateCcw } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState(null); // 'researcher' | null
  const [currentView, setCurrentView] = useState('landing');
  const [loggedInLabId, setLoggedInLabId] = useState(null); // Kept null for Researcher App

  // Sync state with localStorage to enable real-time updates with Biobank Portal
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('biomarketplace_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('biomarketplace_shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [sandboxFunds, setSandboxFunds] = useState(() => {
    const saved = localStorage.getItem('biomarketplace_sandbox_funds');
    return saved ? Number(saved) : 50000;
  });

  const [labEarnings, setLabEarnings] = useState(() => {
    const saved = localStorage.getItem('biomarketplace_lab_earnings');
    return saved ? JSON.parse(saved) : {
      'dana-farber': 12500,
      'md-anderson': 0,
      'mayo-clinic': 0
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('biomarketplace_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('biomarketplace_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('biomarketplace_sandbox_funds', String(sandboxFunds));
  }, [sandboxFunds]);

  useEffect(() => {
    localStorage.setItem('biomarketplace_lab_earnings', JSON.stringify(labEarnings));
  }, [labEarnings]);

  // Real-time synchronization event listener (triggers when local storage updates from biobank portal tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'biomarketplace_requests' && e.newValue) {
          setRequests(JSON.parse(e.newValue));
        }
        if (e.key === 'biomarketplace_shipments' && e.newValue) {
          setShipments(JSON.parse(e.newValue));
        }
        if (e.key === 'biomarketplace_sandbox_funds' && e.newValue) {
          setSandboxFunds(Number(e.newValue));
        }
        if (e.key === 'biomarketplace_lab_earnings' && e.newValue) {
          setLabEarnings(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error("Storage sync error in Researcher Portal:", err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const resetDemo = () => {
    const freshRequests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
    const freshShipments = JSON.parse(JSON.stringify(INITIAL_SHIPMENTS));
    const freshEarnings = {
      'dana-farber': 12500,
      'md-anderson': 0,
      'mayo-clinic': 0
    };

    setRequests(freshRequests);
    setShipments(freshShipments);
    setRole(null);
    setCurrentView('landing');
    setSandboxFunds(50000);
    setLabEarnings(freshEarnings);

    // Save immediately to localStorage to sync other tabs
    localStorage.setItem('biomarketplace_requests', JSON.stringify(freshRequests));
    localStorage.setItem('biomarketplace_shipments', JSON.stringify(freshShipments));
    localStorage.setItem('biomarketplace_sandbox_funds', '50000');
    localStorage.setItem('biomarketplace_lab_earnings', JSON.stringify(freshEarnings));

    alert("Demo reset successfully. All requests, shipments, and wallet balances have been restored to default states.");
  };

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onSelectResearcher={() => {
          setRole('researcher');
          setCurrentView('researcher_landing');
        }} 
        onSelectBiobank={() => {
          // Navigate browser directly to the separate biobank.html endpoint
          window.location.href = 'biobank.html';
        }} 
      />
    );
  }

  if (currentView === 'researcher_landing') {
    return (
      <ResearcherLandingPage 
        onStart={() => setCurrentView('researcher')} 
        onBackToGateway={() => {
          setRole(null);
          setCurrentView('landing');
        }} 
      />
    );
  }

  const getHeaderDetails = () => {
    switch (currentView) {
      case 'researcher':
        return {
          title: 'Researcher Cohort Portal',
          subtitle: 'Initiate sample requests, define clinical criteria, and view direct estimates from biobanks.'
        };
      case 'tracker':
        return {
          title: 'iTracker Cold-Chain Tracking Node',
          subtitle: 'Real-time multi-site shipment tracker, cold-chain temperature telemetry, and delivery confirmations.'
        };
      case 'payment':
        return {
          title: 'Direct Payment Ledger',
          subtitle: 'Verify direct payments, check individual biobank earnings, and audit transactions.'
        };
      default:
        return {
          title: 'Sponsor Portal Workspace',
          subtitle: 'Cohort configuration inquiries and audit logs.'
        };
    }
  };

  const header = getHeaderDetails();

  const renderActiveView = () => {
    switch (currentView) {
      case 'researcher':
        return (
          <ResearcherDashboard 
            requests={requests} 
            setRequests={setRequests} 
            sandboxFunds={sandboxFunds} 
            setSandboxFunds={setSandboxFunds}
            labEarnings={labEarnings}
            setLabEarnings={setLabEarnings}
            shipments={shipments}
            setShipments={setShipments}
          />
        );
      case 'tracker':
        return (
          <ResearcherTracker 
            shipments={shipments} 
            requests={requests} 
          />
        );
      case 'payment':
        return (
          <ResearcherPaymentHub 
            requests={requests} 
            sandboxFunds={sandboxFunds}
            setSandboxFunds={setSandboxFunds}
            labEarnings={labEarnings}
          />
        );
      default:
        return (
          <ResearcherDashboard 
            requests={requests} 
            setRequests={setRequests} 
            sandboxFunds={sandboxFunds} 
            setSandboxFunds={setSandboxFunds}
            labEarnings={labEarnings}
            setLabEarnings={setLabEarnings}
            shipments={shipments}
            setShipments={setShipments}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        loggedInLabId={loggedInLabId}
        setLoggedInLabId={setLoggedInLabId}
        role="researcher"
        setRole={setRole}
      />

      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="logo-dark-text.png" alt="1Cell.Ai Logo" style={{ height: '44px', width: 'auto', display: 'block' }} />
            <div style={{ width: '1px', height: '36px', background: 'var(--border-light)' }}></div>
            <div className="page-title-group">
              <h1 style={{ fontSize: '24px' }}>{header.title}</h1>
              <p style={{ marginTop: '2px' }}>{header.subtitle}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '11.5px', 
                minHeight: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                border: '1px solid rgba(239, 68, 68, 0.25)', 
                color: 'var(--accent-rose)',
                background: 'rgba(239, 68, 68, 0.04)',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s',
                fontWeight: '600'
              }}
              onClick={resetDemo}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)'}
            >
              <RotateCcw size={12} /> Reset Demo
            </button>

            <div className="role-switcher-banner">
              <span>ACTIVE SYSTEM NODE</span>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'rgba(255,255,255,0.06)', 
                  padding: '4px 10px', 
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#ffffff'
                }}
              >
                <Network size={12} style={{ color: 'var(--accent-teal)' }} />
                <span>MULTISITE ACTIVE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Info Notification Panel about the Sponsor Workflow */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '16px 20px', 
            marginBottom: '32px', 
            borderLeft: '4px solid var(--accent-indigo)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(79, 172, 254, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layers size={18} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              <strong>Sponsor Workspace Guide:</strong> Create cohort request → Review quotes received from biobanks → Accept quote and pay directly → Track dry-ice cold-chain logistics in real-time.
            </p>
          </div>
          <a 
            href="#help" 
            style={{ 
              fontSize: '12px', 
              color: 'var(--accent-teal)', 
              textDecoration: 'none', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onClick={(e) => {
              e.preventDefault();
              alert(
                "Sponsor & Researcher Workspace Checklist:\n\n" +
                "1. Cohort Inquiries: Define demographic and cancer criteria to publish requests.\n" +
                "2. Price Quotes: Click 'View Estimates' on pending inquiries to compare quotes from labs, then accept and pay biobanks directly.\n" +
                "3. Wallet Ledger: Refill your sandbox wallet card and check your transaction invoice audit history."
              );
            }}
          >
            <HelpCircle size={14} /> Sponsor Info
          </a>
        </div>

        {/* Active View render */}
        {renderActiveView()}
      </main>
    </div>
  );
}
