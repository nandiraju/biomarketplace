import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BiobankLandingPage from './components/BiobankLandingPage';
import BiobankLogin from './components/BiobankLogin';
import LabILIMS from './components/LabILIMS';
import BiobankTracker from './components/BiobankTracker';
import BiobankPaymentHub from './components/BiobankPaymentHub';
import { INITIAL_REQUESTS, INITIAL_SHIPMENTS, MOCK_LABS } from './data/mockData';
import { HelpCircle, Network, Layers, ShieldCheck, RotateCcw } from 'lucide-react';

export default function AppBiobank() {
  const [currentView, setCurrentView] = useState('biobank_landing');
  const [loggedInLabId, setLoggedInLabId] = useState(null);

  // Sync state with localStorage to enable real-time updates from Researcher Portal
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

  // Real-time synchronization event listener (triggers when local storage updates from researcher portal tab)
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
        console.error("Storage sync error in Biobank Portal:", err);
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
    setLoggedInLabId(null);
    setCurrentView('biobank_landing');
    setSandboxFunds(50000);
    setLabEarnings(freshEarnings);

    // Save immediately to localStorage to sync other tabs
    localStorage.setItem('biomarketplace_requests', JSON.stringify(freshRequests));
    localStorage.setItem('biomarketplace_shipments', JSON.stringify(freshShipments));
    localStorage.setItem('biomarketplace_sandbox_funds', '50000');
    localStorage.setItem('biomarketplace_lab_earnings', JSON.stringify(freshEarnings));

    alert("Demo reset successfully. All requests, shipments, and wallet balances have been restored to default states.");
  };

  // Redirect to root selection gateway if they exit
  const handleExitToGateway = () => {
    setLoggedInLabId(null);
    window.location.href = './';
  };

  // Biobank landing view routing
  if (currentView === 'biobank_landing') {
    return (
      <BiobankLandingPage 
        onStart={() => setCurrentView('lab')} 
        onBackToGateway={handleExitToGateway} 
      />
    );
  }

  // Standalone full-screen node coordinator login page
  if (!loggedInLabId) {
    return (
      <BiobankLogin 
        onLogin={(labId) => {
          setLoggedInLabId(labId);
          setCurrentView('lab');
        }}
        onBackToGateway={handleExitToGateway}
      />
    );
  }

  const getHeaderDetails = () => {
    switch (currentView) {
      case 'lab':
        return {
          title: 'Biobank Partner Workspace',
          subtitle: 'Submit price estimates for active inquiries and manage physical LIMS specimen collections.'
        };
      case 'tracker':
        return {
          title: 'Specimen Dispatch Control',
          subtitle: 'Real-time multi-site shipment tracker, cold-chain temperature telemetry, and delivery confirmations.'
        };
      case 'payment':
        return {
          title: 'Laboratory Earnings Hub',
          subtitle: 'Verify direct payment receipts, monitor biobank node balances, and audit transactions.'
        };
      default:
        return {
          title: 'Biobank Core Node Workspace',
          subtitle: 'LIMS inventory allocations and dispatch monitoring.'
        };
    }
  };

  const header = getHeaderDetails();

  const renderActiveView = () => {
    switch (currentView) {
      case 'lab':
        return (
          <LabILIMS 
            requests={requests} 
            setRequests={setRequests} 
            shipments={shipments} 
            setShipments={setShipments} 
            loggedInLabId={loggedInLabId}
            setLoggedInLabId={setLoggedInLabId}
          />
        );
      case 'tracker':
        return (
          <BiobankTracker 
            shipments={shipments} 
            setShipments={setShipments} 
            requests={requests} 
            setRequests={setRequests} 
            loggedInLabId={loggedInLabId}
          />
        );
      case 'payment':
        return (
          <BiobankPaymentHub 
            requests={requests} 
            labEarnings={labEarnings}
            loggedInLabId={loggedInLabId}
          />
        );
      default:
        return (
          <LabILIMS 
            requests={requests} 
            setRequests={setRequests} 
            shipments={shipments} 
            setShipments={setShipments} 
            loggedInLabId={loggedInLabId}
            setLoggedInLabId={setLoggedInLabId}
          />
        );
    }
  };

  const activeLab = MOCK_LABS.find(l => l.id === loggedInLabId) || MOCK_LABS[0];

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        loggedInLabId={loggedInLabId}
        setLoggedInLabId={setLoggedInLabId}
        role="biobank"
        setRole={handleExitToGateway} // Trigger exit redirection
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
              <span>CONNECTED NODE</span>
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
                <Network size={12} style={{ color: activeLab.color || 'var(--accent-teal)' }} />
                <span>{activeLab.code} NODE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Info Notification Panel about the Biobank Workflow */}
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
              <strong>Supplier Node Guide:</strong> View pending researcher inquiries → Draft and publish price quotes → Once paid directly, match inventory barcodes → Hand parcel over to courier for transit cold-chain logging.
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
                "Biobank Partner Node Checklist:\n\n" +
                "1. Pending Inquiries: Review demographic criteria, and LIMS matching counts. Enter your estimated price and capacity notes to publish quotes.\n" +
                "2. Active Fulfillments: Once a Researcher accepts and pays you directly, requests shift here. Select matching physical inventory barcodes, then click Allocate & Ship.\n" +
                "3. Specimen Shipments: Dispatch carriers and check cold-chain temperature coordinates."
              );
            }}
          >
            <HelpCircle size={14} /> Node Info
          </a>
        </div>

        {/* Active View render */}
        {renderActiveView()}
      </main>
    </div>
  );
}
