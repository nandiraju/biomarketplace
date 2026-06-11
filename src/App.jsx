import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import ResearcherLandingPage from './components/ResearcherLandingPage';
import BiobankLandingPage from './components/BiobankLandingPage';
import ResearcherDashboard from './components/ResearcherDashboard';
import LabILIMS from './components/LabILIMS';
import LogisticsITracker from './components/LogisticsITracker';
import PaymentHub from './components/PaymentHub';
import { INITIAL_REQUESTS, INITIAL_SHIPMENTS } from './data/mockData';
import { HelpCircle, Network, Layers, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [loggedInLabId, setLoggedInLabId] = useState(null);
  const [sandboxFunds, setSandboxFunds] = useState(50000);
  const [labEarnings, setLabEarnings] = useState({
    'dana-farber': 12500,
    'md-anderson': 0,
    'mayo-clinic': 0
  });

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onSelectResearcher={() => setCurrentView('researcher_landing')} 
        onSelectBiobank={() => setCurrentView('biobank_landing')} 
      />
    );
  }

  if (currentView === 'researcher_landing') {
    return (
      <ResearcherLandingPage 
        onStart={() => setCurrentView('researcher')} 
        onBackToGateway={() => setCurrentView('landing')} 
      />
    );
  }

  if (currentView === 'biobank_landing') {
    return (
      <BiobankLandingPage 
        onStart={() => setCurrentView('lab')} 
        onBackToGateway={() => setCurrentView('landing')} 
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
      case 'lab':
        return {
          title: 'Biobank Partner Workspace',
          subtitle: 'Submit price estimates for active requests and manage physical LIMS specimen collections.'
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
          title: 'Federated Biobank Management System',
          subtitle: 'Standardized sample collection, tracking, and payments across clinical sites.'
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
          />
        );
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
          <LogisticsITracker 
            shipments={shipments} 
            setShipments={setShipments} 
            requests={requests} 
            setRequests={setRequests} 
          />
        );
      case 'payment':
        return (
          <PaymentHub 
            requests={requests} 
            sandboxFunds={sandboxFunds}
            setSandboxFunds={setSandboxFunds}
            labEarnings={labEarnings}
          />
        );
      default:
        return <ResearcherDashboard requests={requests} setRequests={setRequests} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        loggedInLabId={loggedInLabId}
        setLoggedInLabId={setLoggedInLabId}
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

        {/* Info Notification Panel about the Federated Workflow */}
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
              <strong>System Integration Guide:</strong> Follow the workflow: Create inquiry as <strong>Researcher</strong> → Log in as a <strong>Biobank Partner</strong> to submit price estimates → <strong>Researcher</strong> accepts and pays directly → <strong>Biobank</strong> allocates local specimens → Track cold-chain delivery in <strong>iTracker</strong>.
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
                "This system coordinates direct payments and price estimates across distributed labs.\n\n" +
                "1. Researcher Portal: Submit criteria (e.g. Stage III Breast Cancer). Review quotes submitted by biobanks.\n" +
                "2. Biobank Portal: Log in as Dana-Farber, MD Anderson, or Mayo Clinic. View pending researcher inquiries, submit price estimates, and once paid, allocate samples for shipment.\n" +
                "3. iTracker: Track dry-ice cold-chain parcel coordinates and temperatures in real-time."
              );
            }}
          >
            <HelpCircle size={14} /> Quick Tour
          </a>
        </div>

        {/* Active View render */}
        {renderActiveView()}
      </main>
    </div>
  );
}
