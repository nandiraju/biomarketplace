import React, { useState } from 'react';
import { Truck, Thermometer, MapPin, Navigation, ArrowRight, ShieldCheck, List, Table, Hash, Clipboard, FlaskConical, Activity, ArrowUpDown } from 'lucide-react';

export default function LogisticsITracker({ shipments, setShipments, requests, setRequests }) {
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.id || null);
  const [viewMode, setViewMode] = useState('table');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const selectedShipment = shipments.find((s) => s.id === selectedShipmentId);

  const advanceShipment = (shipmentId) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (!shipment || shipment.currentStepIndex >= shipment.steps.length - 1) return;

    const nextStepIndex = shipment.currentStepIndex + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const updatedSteps = shipment.steps.map((step, idx) => {
      if (idx < nextStepIndex) {
        return { ...step, status: 'completed', date: step.date || nowStr };
      } else if (idx === nextStepIndex) {
        return { ...step, status: nextStepIndex === shipment.steps.length - 1 ? 'completed' : 'current', date: nowStr };
      } else {
        return { ...step, status: 'pending', date: null };
      }
    });

    // Generate random temperature reading to add to logs
    const currentTemp = -78 - Math.random() * 3;
    const updatedTempMonitoring = [
      ...shipment.tempMonitoring,
      { time: nowStr.split(' ')[1], temp: parseFloat(currentTemp.toFixed(1)) }
    ];

    // Update shipments state
    const updatedShipments = shipments.map((s) => {
      if (s.id === shipmentId) {
        return {
          ...s,
          currentStepIndex: nextStepIndex,
          steps: updatedSteps,
          tempMonitoring: updatedTempMonitoring
        };
      }
      return s;
    });
    setShipments(updatedShipments);

    // If it reached "Delivered & Confirmed" (index 6), update request status
    if (nextStepIndex === shipment.steps.length - 1) {
      // Find request associated with this shipment
      const request = requests.find((r) => r.id === shipment.requestId);
      if (request) {
        // Mark request status as 'Delivered'
        const updatedRequests = requests.map((r) => {
          if (r.id === request.id) {
            return {
              ...r,
              status: 'Delivered'
            };
          }
          return r;
        });
        setRequests(updatedRequests);
      }
    }
  };

  const getLabName = (labId) => {
    switch (labId) {
      case 'dana-farber': return 'Dana-Farber (DFCI)';
      case 'md-anderson': return 'MD Anderson (MDAB)';
      case 'mayo-clinic': return 'Mayo Clinic (MCTH)';
      default: return labId;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedShipments = [...shipments].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'id') {
      aVal = a.id;
      bVal = b.id;
    } else if (sortField === 'title') {
      aVal = a.requestTitle;
      bVal = b.requestTitle;
    } else if (sortField === 'lab') {
      aVal = getLabName(a.labId);
      bVal = getLabName(b.labId);
    } else if (sortField === 'step') {
      aVal = a.steps[a.currentStepIndex]?.name || '';
      bVal = b.steps[b.currentStepIndex]?.name || '';
    } else if (sortField === 'status') {
      aVal = a.currentStepIndex === a.steps.length - 1 ? 1 : 0;
      bVal = b.currentStepIndex === b.steps.length - 1 ? 1 : 0;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' 
        ? aVal - bVal 
        : bVal - aVal;
    }
  });

  return (
    <div className="tracker-layout">
      {/* Left Column: Shipment List */}
      <div className="glass-panel">
        <div className="panel-header">
          <h2>
            <Truck size={18} style={{ color: 'var(--accent-teal)' }} /> iTracker Shipments
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'rgba(26, 54, 93, 0.04)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <button 
                type="button"
                className="btn" 
                style={{ padding: '6px 10px', fontSize: '12px', background: viewMode === 'list' ? '#ffffff' : 'transparent', border: 'none', boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', minHeight: 'auto', gap: '4px' }}
                onClick={() => setViewMode('list')}
              >
                <List size={14} /> Card
              </button>
              <button 
                type="button"
                className="btn" 
                style={{ padding: '6px 10px', fontSize: '12px', background: viewMode === 'table' ? '#ffffff' : 'transparent', border: 'none', boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', minHeight: 'auto', gap: '4px' }}
                onClick={() => setViewMode('table')}
              >
                <Table size={14} /> Table
              </button>
            </div>
            <span className="badge badge-progress" style={{ fontSize: '11px' }}>
              {shipments.length} Active Tracks
            </span>
          </div>
        </div>

        <div className="panel-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {shipments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No shipments currently registered. Fulfill a request in the iLIMS dashboard to create a shipment.
            </div>
          ) : viewMode === 'table' ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="ledger-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                    <th style={{ cursor: 'pointer', padding: '8px' }} onClick={() => handleSort('id')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Hash size={12} style={{ color: 'var(--accent-teal)' }} /> Ship ID <ArrowUpDown size={11} style={{ opacity: sortField === 'id' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', padding: '8px' }} onClick={() => handleSort('title')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clipboard size={12} /> Study Cohort <ArrowUpDown size={11} style={{ opacity: sortField === 'title' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', padding: '8px' }} onClick={() => handleSort('lab')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FlaskConical size={12} /> Source Lab <ArrowUpDown size={11} style={{ opacity: sortField === 'lab' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', padding: '8px' }} onClick={() => handleSort('step')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Navigation size={12} style={{ transform: 'rotate(45deg)' }} /> Current Step <ArrowUpDown size={11} style={{ opacity: sortField === 'step' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', padding: '8px' }} onClick={() => handleSort('status')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={12} /> Status <ArrowUpDown size={11} style={{ opacity: sortField === 'status' ? 1 : 0.4 }} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedShipments.map((shipment) => {
                    const currentStep = shipment.steps[shipment.currentStepIndex];
                    const isDelivered = shipment.currentStepIndex === shipment.steps.length - 1;
                    const isSelected = selectedShipmentId === shipment.id;

                    return (
                      <tr
                        key={shipment.id}
                        style={{
                          borderBottom: '1px solid var(--border-light)',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(32, 153, 232, 0.05)' : 'transparent'
                        }}
                        onClick={() => setSelectedShipmentId(shipment.id)}
                      >
                        <td style={{ fontWeight: '600', color: 'var(--accent-teal)', padding: '8px' }}>{shipment.id}</td>
                        <td style={{ padding: '8px' }}>
                          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{shipment.requestTitle}</strong>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Sample: {shipment.sampleId}</span>
                        </td>
                        <td style={{ padding: '8px' }}>{getLabName(shipment.labId).split(' ')[0]}</td>
                        <td style={{ padding: '8px', color: 'var(--accent-indigo)', fontWeight: '500' }}>
                          {currentStep?.name}
                        </td>
                        <td style={{ padding: '8px' }}>
                          <span className={`badge ${isDelivered ? 'badge-success' : 'badge-progress'}`} style={{ fontSize: '9px' }}>
                            {isDelivered ? 'Delivered' : 'In Transit'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            sortedShipments.map((shipment) => {
              const currentStep = shipment.steps[shipment.currentStepIndex];
              const isDelivered = shipment.currentStepIndex === shipment.steps.length - 1;

              return (
                <div
                  key={shipment.id}
                  className={`shipment-compact-card ${selectedShipmentId === shipment.id ? 'active' : ''}`}
                  onClick={() => setSelectedShipmentId(shipment.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 'bold' }}>{shipment.id}</span>
                    <span className={`badge ${isDelivered ? 'badge-success' : 'badge-progress'}`} style={{ fontSize: '9px' }}>
                      {isDelivered ? 'Delivered' : 'In Transit'}
                    </span>
                  </div>

                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {shipment.requestTitle}
                  </strong>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    <span>From: {getLabName(shipment.labId)}</span>
                    <span>Sample: {shipment.sampleId}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '12px', color: 'var(--accent-indigo)' }}>
                    <Navigation size={12} style={{ transform: 'rotate(45deg)' }} />
                    <span style={{ fontWeight: '500' }}>{currentStep?.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Detailed Tracker View */}
      {selectedShipment ? (
        <div className="glass-panel">
          <div className="panel-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h2 style={{ fontSize: '18px' }}>Tracking Details - {selectedShipment.id}</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Carrier: {selectedShipment.carrier}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Tracking Number: <strong style={{ color: 'var(--text-primary)' }}>{selectedShipment.trackingNumber}</strong>
            </div>
          </div>

          <div className="panel-body">
            {/* Simulation controls */}
            {selectedShipment.currentStepIndex < selectedShipment.steps.length - 1 ? (
              <div style={{ 
                background: 'rgba(79, 172, 254, 0.08)', 
                border: '1px solid var(--border-glow)', 
                padding: '16px', 
                borderRadius: '12px', 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)' }}>Carrier Simulation Panel</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Advance shipment to next checkpoint to simulate logistics progress.</span>
                </div>
                <button className="btn btn-primary" onClick={() => advanceShipment(selectedShipment.id)}>
                  Advance Status <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid var(--border-emerald-glow)', 
                padding: '16px', 
                borderRadius: '12px', 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShieldCheck size={24} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--accent-emerald)' }}>Shipment Fully Delivered & Confirmed</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Sample {selectedShipment.sampleId} has reached the target site. Direct payment has been settled.
                  </span>
                </div>
              </div>
            )}

            {/* Cold Chain Monitor */}
            <div className="temp-monitor">
              <div className="temp-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Thermometer size={18} style={{ color: 'var(--accent-teal)' }} />
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>Cold Chain Temperature Monitoring</span>
                </div>
                <div className="temp-status">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
                  Active (-80°C Dry Ice)
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Sensor Node: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>TEMPSENS-{selectedShipment.id.split('-')[1]}</span>
              </div>

              {/* Sparkline */}
              <div className="temp-sparkline">
                {selectedShipment.tempMonitoring.map((log, idx) => {
                  // Normalize temp around -85 to -75 range
                  // Let height be percentage
                  const normTemp = Math.abs(log.temp);
                  // Normal height between 30px and 60px
                  const barHeight = ((normTemp - 70) / 15) * 50 + 10;

                  return (
                    <div 
                      key={idx} 
                      className="temp-bar" 
                      style={{ height: `${Math.min(Math.max(barHeight, 10), 60)}px` }}
                    >
                      <span className="temp-bar-label">{log.temp}°C</span>
                    </div>
                  );
                })}
              </div>

              <div className="temp-timeline-labels">
                <span>{selectedShipment.tempMonitoring[0]?.time || '10:00'}</span>
                <span>Current: {selectedShipment.tempMonitoring[selectedShipment.tempMonitoring.length - 1]?.temp}°C</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline">
              {selectedShipment.steps.map((step, idx) => {
                let statusClass = 'pending';
                if (idx < selectedShipment.currentStepIndex) statusClass = 'completed';
                else if (idx === selectedShipment.currentStepIndex) statusClass = 'current';

                return (
                  <div key={idx} className={`timeline-item ${statusClass}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-title">{step.name}</span>
                      {step.date && <span className="timeline-date">{step.date}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GPS Map mockup */}
            <div style={{ 
              marginTop: '24px', 
              height: '140px', 
              borderRadius: '12px', 
              border: '1px solid var(--border-light)',
              background: 'linear-gradient(225deg, rgba(8, 12, 21, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Fake grid lines */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', width: '1px', background: 'rgba(255,255,255,0.02)' }}></div>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(255,255,255,0.02)' }}></div>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '75%', width: '1px', background: 'rgba(255,255,255,0.02)' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '33%', height: '1px', background: 'rgba(255,255,255,0.02)' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '66%', height: '1px', background: 'rgba(255,255,255,0.02)' }}></div>

              {/* Route lines */}
              <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                <path 
                  d="M 60,70 Q 150,20 280,60" 
                  fill="none" 
                  stroke="rgba(79, 172, 254, 0.15)" 
                  strokeWidth="3" 
                  strokeDasharray="6 4"
                />
                <path 
                  d={`M 60,70 Q 150,20 ${60 + (selectedShipment.currentStepIndex / 6) * 220},${70 - (selectedShipment.currentStepIndex / 6) * 10}`} 
                  fill="none" 
                  stroke="var(--accent-indigo)" 
                  strokeWidth="3" 
                />
              </svg>

              {/* Lab location point */}
              <div style={{ position: 'absolute', left: '60px', top: '70px', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-teal)' }}></div>
                <span style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>Lab Core</span>
              </div>

              {/* Transit indicator */}
              <div style={{ 
                position: 'absolute', 
                left: `${60 + (selectedShipment.currentStepIndex / 6) * 220}px`, 
                top: `${70 - (selectedShipment.currentStepIndex / 6) * 10}px`, 
                transform: 'translate(-50%, -50%)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                zIndex: 10,
                transition: 'all 0.5s ease'
              }}>
                <div style={{ 
                  background: 'var(--accent-indigo)', 
                  border: '2px solid white', 
                  borderRadius: '50%', 
                  width: '12px', 
                  height: '12px', 
                  boxShadow: '0 0 10px var(--accent-indigo)',
                  animation: 'pulse-dot 1.5s infinite alternate' 
                }}></div>
              </div>

              {/* Destination point */}
              <div style={{ position: 'absolute', left: '280px', top: '60px', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <MapPin size={12} style={{ color: 'var(--accent-emerald)' }} />
                <span style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>Delivery Site</span>
              </div>

              <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '9px', color: 'var(--text-muted)' }}>
                GPS Monitoring Online
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
          Select a shipment to monitor logistics timelines and temperature records.
        </div>
      )}
    </div>
  );
}
