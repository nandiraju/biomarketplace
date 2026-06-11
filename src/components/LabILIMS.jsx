import React, { useState } from 'react';
import { MOCK_LABS, MOCK_INVENTORIES } from '../data/mockData';
import { Database, Layers, CheckCircle2, ChevronRight, Activity, FlaskConical, List, Table, Hash, Clipboard, ArrowUpDown, User, Dna, Thermometer } from 'lucide-react';

export default function LabILIMS({ requests, setRequests, shipments, setShipments, loggedInLabId, setLoggedInLabId }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [subView, setSubView] = useState('estimates'); // 'estimates' or 'active-requests'


  // Submit Quote form states
  const [priceQuote, setPriceQuote] = useState('');
  const [samplesQuote, setSamplesQuote] = useState(1);
  const [notesQuote, setNotesQuote] = useState('');

  const selectedLab = MOCK_LABS.find((l) => l.id === loggedInLabId) || MOCK_LABS[0];
  const localInventory = MOCK_INVENTORIES[loggedInLabId] || [];

  // Filter requests:
  // 1. Unpaid inquiries awaiting estimates
  const quoteRequests = requests.filter((req) => req.status === 'Awaiting Estimates');
  // 2. Paid processing requests specifically assigned/paid to this biobank
  const activeRequests = requests.filter((req) => req.status === 'Paid & Processing' && req.selectedLabId === loggedInLabId);

  const currentRequestsList = subView === 'active-requests' ? activeRequests : quoteRequests;

  // Helper to determine if an inventory sample matches the request criteria
  const isSampleMatch = (sample, criteria) => {
    // Match logic:
    // sample gender, age (within ageGroup range), cancerType, cancerStage, demography, tissueType
    if (criteria.gender !== 'All' && sample.gender !== criteria.gender) return false;
    if (criteria.cancerType !== 'All' && sample.cancerType !== criteria.cancerType) return false;
    if (criteria.cancerStage !== 'All' && sample.cancerStage !== criteria.cancerStage) return false;
    if (criteria.demography !== 'All' && sample.demography !== criteria.demography) return false;
    if (criteria.tissueType && sample.tissueType !== criteria.tissueType) return false;

    // Age group check
    if (criteria.ageGroup !== 'All') {
      const age = sample.age;
      if (criteria.ageGroup === '18-35' && (age < 18 || age > 35)) return false;
      if (criteria.ageGroup === '36-50' && (age < 36 || age > 50)) return false;
      if (criteria.ageGroup === '51-65' && (age < 51 || age > 65)) return false;
      if (criteria.ageGroup === '66+' && age < 66) return false;
    }

    return true;
  };

  // Find matching samples in local inventory for a given request
  const getMatchesForRequest = (req) => {
    return localInventory.filter((sample) => isSampleMatch(sample, req.criteria));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRequests = [...currentRequestsList].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'id') {
      aVal = a.id;
      bVal = b.id;
    } else if (sortField === 'title') {
      aVal = a.title;
      bVal = b.title;
    } else if (sortField === 'fulfillment') {
      aVal = a.fulfilledSamples.length / a.targetQuantity;
      bVal = b.fulfilledSamples.length / b.targetQuantity;
    } else if (sortField === 'matches') {
      aVal = getMatchesForRequest(a).length;
      bVal = getMatchesForRequest(b).length;
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

  // Handle Quote submission
  const handleEstimateSubmit = (req, e) => {
    e.preventDefault();
    if (!priceQuote) return;

    const newEstimate = {
      labId: loggedInLabId,
      price: Number(priceQuote),
      samplesCount: Number(samplesQuote || req.targetQuantity),
      notes: notesQuote
    };

    // Remove any previous estimate from this lab
    const filteredEstimates = (req.estimates || []).filter(e => e.labId !== loggedInLabId);

    const updatedRequests = requests.map((r) => {
      if (r.id === req.id) {
        return {
          ...r,
          estimates: [...filteredEstimates, newEstimate]
        };
      }
      return r;
    });

    setRequests(updatedRequests);
    setPriceQuote('');
    setNotesQuote('');
    setSelectedRequest(null);
    alert('Quote submitted successfully to researcher.');
  };

  // Handle allocation / fulfillment
  const handleFulfill = (req) => {
    if (selectedSampleIds.length === 0) return;

    // 1. Mark selected samples in requests
    const fulfilledSamples = selectedSampleIds.map((id) => {
      const sample = localInventory.find((s) => s.id === id);
      return {
        id: sample.id,
        labId: loggedInLabId,
        gender: sample.gender,
        age: sample.age,
        cancerType: sample.cancerType,
        cancerStage: sample.cancerStage,
        demography: sample.demography,
        tissueType: sample.tissueType,
        rinScore: sample.rinScore,
        collectedDate: new Date().toISOString().split('T')[0],
        shipmentId: `SHIP-${Date.now().toString().slice(-3)}-${sample.id.split('-').pop()}`
      };
    });

    // Update global requests
    const updatedRequests = requests.map((r) => {
      if (r.id === req.id) {
        const combined = [...r.fulfilledSamples, ...fulfilledSamples];
        const isFullyFulfilled = combined.length >= r.targetQuantity;
        return {
          ...r,
          fulfilledSamples: combined,
          status: isFullyFulfilled ? 'Fully Fulfilled' : 'Paid & Processing'
        };
      }
      return r;
    });
    
    setRequests(updatedRequests);

    // 2. Create iTracker Shipments for these allocated samples
    const newShipments = fulfilledSamples.map((sample) => {
      return {
        id: sample.shipmentId,
        requestId: req.id,
        requestTitle: req.title,
        sampleId: sample.id,
        labId: loggedInLabId,
        carrier: 'BioExpress Logistics',
        trackingNumber: `BIO-${selectedLab.code}-${Date.now().toString().slice(-4)}-${sample.id.split('-').pop()}`,
        steps: [
          { name: 'Request Assigned', status: 'completed', date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
          { name: 'Sample Collection & Barcoding', status: 'completed', date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
          { name: 'LIMS Quality Control (RIN > 7.0)', status: 'completed', date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
          { name: 'Dry Ice Pack & Ready', status: 'current', date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
          { name: 'Carrier Dispatch', status: 'pending', date: null },
          { name: 'In Transit (Cold-Chain Active)', status: 'pending', date: null },
          { name: 'Delivered & Confirmed', status: 'pending', date: null }
        ],
        currentStepIndex: 3,
        tempMonitoring: [
          { time: '14:00', temp: -78.5 },
          { time: '15:00', temp: -79.2 },
          { time: '16:00', temp: -78.9 }
        ],
        lat: 42.3601,
        lng: -71.0589
      };
    });

    setShipments([...newShipments, ...shipments]);

    // Reset local selection state
    setSelectedRequest(null);
    setSelectedSampleIds([]);
  };

  const handleSelectSample = (sampleId) => {
    if (selectedSampleIds.includes(sampleId)) {
      setSelectedSampleIds(selectedSampleIds.filter((id) => id !== sampleId));
    } else {
      setSelectedSampleIds([...selectedSampleIds, sampleId]);
    }
  };



  return (
    <div>
      {/* Biobank Node Status Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeft: `5px solid ${selectedLab.color || 'var(--accent-teal)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '28px' }}>{selectedLab.logo}</span>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '700', letterSpacing: '0.05em' }}>
              Connected LIMS Partner Node
            </span>
            <h3 style={{ fontSize: '18px', margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{selectedLab.name}</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Core Code: <strong>{selectedLab.code}</strong> • Location: {selectedLab.location} • Contact: {selectedLab.contact}
            </span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => { setLoggedInLabId(null); setSelectedRequest(null); }}>
          Log Out Node
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Requests Inbox */}
        <div className="glass-panel">
          <div className="panel-header">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2>
                <FlaskConical size={18} style={{ color: 'var(--accent-teal)' }} /> Biobank Marketplace Portal
              </h2>
              {/* Quoting vs Fulfillment subview selector tabs */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button 
                  className="btn" 
                  style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    background: subView === 'estimates' ? 'rgba(32, 153, 232, 0.1)' : 'transparent',
                    border: '1px solid ' + (subView === 'estimates' ? 'var(--accent-blue)' : 'var(--border-light)'),
                    color: subView === 'estimates' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    minHeight: 'auto'
                  }}
                  onClick={() => { setSubView('estimates'); setSelectedRequest(null); }}
                >
                  Pending Inquiries ({quoteRequests.length})
                </button>
                <button 
                  className="btn"
                  style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    background: subView === 'active-requests' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    border: '1px solid ' + (subView === 'active-requests' ? 'var(--accent-emerald)' : 'var(--border-light)'),
                    color: subView === 'active-requests' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                    minHeight: 'auto'
                  }}
                  onClick={() => { setSubView('active-requests'); setSelectedRequest(null); }}
                >
                  Active Fulfillments (Paid) ({activeRequests.length})
                </button>
              </div>
            </div>
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
            </div>
          </div>

          <div className="panel-body">
            {currentRequestsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                {subView === 'estimates' 
                  ? 'No pending inquiries awaiting quotes.' 
                  : 'No paid shipments currently allocated. Accept quotes and receive direct payments in the Researcher dashboard first.'}
              </div>
            ) : viewMode === 'table' ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="ledger-table" style={{ width: '100%', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('id')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Hash size={13} style={{ color: 'var(--accent-teal)' }} /> ID <ArrowUpDown size={12} style={{ opacity: sortField === 'id' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('title')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clipboard size={13} /> Cohort Description <ArrowUpDown size={12} style={{ opacity: sortField === 'title' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('fulfillment')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Activity size={13} /> Qty <ArrowUpDown size={12} style={{ opacity: sortField === 'fulfillment' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('matches')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Database size={13} /> Local matches <ArrowUpDown size={12} style={{ opacity: sortField === 'matches' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRequests.map((req) => {
                      const matches = getMatchesForRequest(req);
                      const isSelected = selectedRequest?.id === req.id;
                      const currentlySupplied = req.fulfilledSamples.filter(s => s.labId === loggedInLabId).length;
                      const quoteSubmitted = req.estimates?.find(e => e.labId === loggedInLabId);

                      return (
                        <tr 
                          key={req.id} 
                          style={{ 
                            borderBottom: '1px solid var(--border-light)', 
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(32, 153, 232, 0.05)' : 'transparent' 
                          }}
                          onClick={() => {
                            setSelectedRequest(req);
                            setSelectedSampleIds([]);
                            // Prefill quote inputs
                            if (subView === 'estimates') {
                              setPriceQuote(quoteSubmitted ? quoteSubmitted.price : req.budget);
                              setSamplesQuote(quoteSubmitted ? quoteSubmitted.samplesCount : matches.length || req.targetQuantity);
                              setNotesQuote(quoteSubmitted ? quoteSubmitted.notes : '');
                            }
                          }}
                        >
                          <td style={{ fontWeight: '600', color: 'var(--accent-teal)', padding: '12px' }}>{req.id}</td>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{req.title}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {req.criteria.gender} • {req.criteria.ageGroup} • {req.criteria.cancerType} ({req.criteria.cancerStage}) • {req.criteria.tissueType}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {subView === 'estimates' ? (
                              <span>Req: {req.targetQuantity}</span>
                            ) : (
                              <span className="badge badge-progress" style={{ fontSize: '10px' }}>
                                {req.fulfilledSamples.length} / {req.targetQuantity} Shipped
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px', fontWeight: '600', color: matches.length > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                            {matches.length} matches
                          </td>
                          <td style={{ padding: '12px' }}>
                            {subView === 'estimates' ? (
                              quoteSubmitted ? (
                                <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: '600' }}>
                                  Quoted (${quoteSubmitted.price.toLocaleString()})
                                </span>
                              ) : (
                                <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}>
                                  Quote
                                </button>
                              )
                            ) : (
                              <button 
                                type="button" 
                                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`} 
                                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px', whiteSpace: 'nowrap' }}
                              >
                                Allocate
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="requests-list">
                {sortedRequests.map((req) => {
                  const matches = getMatchesForRequest(req);
                  const isSelected = selectedRequest?.id === req.id;
                  const quoteSubmitted = req.estimates?.find(e => e.labId === loggedInLabId);
                  const currentlySupplied = req.fulfilledSamples.filter(s => s.labId === loggedInLabId).length;

                  return (
                    <div
                      key={req.id}
                      className={`item-card ${isSelected ? 'glow-teal' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedRequest(req);
                        setSelectedSampleIds([]);
                        if (subView === 'estimates') {
                          setPriceQuote(quoteSubmitted ? quoteSubmitted.price : req.budget);
                          setSamplesQuote(quoteSubmitted ? quoteSubmitted.samplesCount : matches.length || req.targetQuantity);
                          setNotesQuote(quoteSubmitted ? quoteSubmitted.notes : '');
                        }
                      }}
                    >
                      <div className="item-card-header" style={{ border: 'none', paddingBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: 'var(--accent-indigo)', fontWeight: '700' }}>{req.id}</span>
                          <div className="item-title" style={{ fontSize: '15px' }}>{req.title}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {subView === 'estimates' ? (
                            quoteSubmitted ? (
                              <span className="badge badge-success" style={{ fontSize: '10px' }}>Quoted</span>
                            ) : (
                              <span className="badge badge-pending" style={{ fontSize: '10px' }}>New</span>
                            )
                          ) : (
                            <span className="badge badge-progress" style={{ fontSize: '10px' }}>
                              {req.fulfilledSamples.length} / {req.targetQuantity} Shipped
                            </span>
                          )}
                          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      </div>

                      <div className="item-card-body" style={{ padding: '0 18px 18px 18px' }}>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                          <div><strong>Target:</strong> {req.criteria.cancerType} ({req.criteria.cancerStage})</div>
                          <div><strong>Format:</strong> {req.criteria.tissueType}</div>
                          <div><strong>Demographics:</strong> {req.criteria.demography} • {req.criteria.gender}</div>
                        </div>

                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: matches.length > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                            {matches.length > 0 ? `✓ ${matches.length} matching samples in local LIMS` : 'No matching samples in local LIMS'}
                          </span>
                          {subView === 'estimates' && quoteSubmitted && (
                            <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: '600' }}>
                              Your price estimate: ${quoteSubmitted.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: iLIMS Fulfillment panel / Local Inventory */}
        <div className="glass-panel">
          <div className="panel-header">
            <h2>
              <Database size={18} style={{ color: 'var(--accent-indigo)' }} /> {selectedRequest ? 'Core Workspace' : 'LIMS Physical Catalog'}
            </h2>
          </div>

          <div className="panel-body">
            {selectedRequest ? (
              subView === 'estimates' ? (
                /* Submit Quote / Price Estimate View */
                <div>
                  <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: '700', textTransform: 'uppercase' }}>
                      Draft Price Quote
                    </span>
                    <h4 style={{ fontSize: '14px', marginTop: '4px' }}>{selectedRequest.title}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Target Quantity: {selectedRequest.targetQuantity} samples • Researcher Budget: ${selectedRequest.budget.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: '600', marginTop: '6px' }}>
                      LIMS matches found: {getMatchesForRequest(selectedRequest).length} specimens available
                    </div>
                  </div>

                  <form onSubmit={(e) => handleEstimateSubmit(selectedRequest, e)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Total Price Estimate ($)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={priceQuote} 
                          onChange={(e) => setPriceQuote(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Fulfillable Samples Qty</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          min="1" 
                          max={selectedRequest.targetQuantity}
                          value={samplesQuote} 
                          onChange={(e) => setSamplesQuote(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Biobank Delivery Notes / Lead Time</label>
                      <textarea 
                        className="form-input" 
                        rows="3" 
                        placeholder="e.g. Can supply immediately. RNA Integrity Numbers average 8.2."
                        value={notesQuote} 
                        onChange={(e) => setNotesQuote(e.target.value)}
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedRequest(null)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                        Publish Quote
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Specimen Allocation View (when Paid & Processing) */
                <div>
                  <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 'bold' }}>Fulfilling Paid Inquiry</div>
                    <h4 style={{ fontSize: '14px', marginTop: '4px' }}>{selectedRequest.title}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Contract Price: ${selectedRequest.budget.toLocaleString()} • Target Qty: {selectedRequest.targetQuantity}
                    </div>
                  </div>

                  <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Select Local Matching Samples
                  </h4>

                  <div className="inventory-grid">
                    {getMatchesForRequest(selectedRequest).map((sample) => {
                      const isChecked = selectedSampleIds.includes(sample.id);
                      const isAllocated = requests.some(r => r.fulfilledSamples.some(s => s.id === sample.id));

                      return (
                        <div
                          key={sample.id}
                          className={`sample-row ${isChecked ? 'matching' : ''}`}
                          style={{ 
                            opacity: isAllocated ? 0.5 : 1, 
                            cursor: isAllocated ? 'not-allowed' : 'pointer',
                            gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr'
                          }}
                          onClick={() => !isAllocated && handleSelectSample(sample.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isAllocated}
                            onChange={() => {}}
                            style={{ marginRight: '10px', cursor: 'pointer' }}
                          />
                          <div>
                            <strong style={{ color: 'var(--text-primary)' }}>{sample.id}</strong>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>QC RIN: {sample.rinScore}</div>
                          </div>
                          <div>{sample.gender} • {sample.age}y</div>
                          <div>{sample.tissueType.split(' ')[0]}</div>
                          <div style={{ color: isAllocated ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: '600', fontSize: '11px' }}>
                            {isAllocated ? 'Allocated' : 'Available'}
                          </div>
                        </div>
                      );
                    })}

                    {getMatchesForRequest(selectedRequest).length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        No matching samples found for this request in {selectedLab.code} inventory.
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedRequest(null)}>
                      Back
                    </button>
                    <button
                      className={`btn ${selectedSampleIds.length > 0 ? 'btn-emerald' : 'btn-disabled'}`}
                      style={{ flex: 2 }}
                      disabled={selectedSampleIds.length === 0}
                      onClick={() => handleFulfill(selectedRequest)}
                    >
                      Allocate & Ship ({selectedSampleIds.length})
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* Local Inventory Catalog View */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Activity size={16} style={{ color: 'var(--accent-indigo)' }} />
                  <span>Physical Storage Repository ({localInventory.length} items)</span>
                </div>

                <div className="inventory-grid">
                  <div className="sample-row header" style={{ gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr 1fr' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Hash size={12} style={{ color: 'var(--accent-teal)' }} /> ID</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} style={{ color: 'var(--accent-indigo)' }} /> Gender/Age</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Dna size={12} style={{ color: 'var(--accent-indigo)' }} /> Cancer / Stage</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={12} style={{ color: 'var(--accent-indigo)' }} /> Tissue Format</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Thermometer size={12} style={{ color: 'var(--accent-teal)' }} /> Temp</span>
                  </div>

                  {localInventory.map((sample) => {
                    const isAllocated = requests.some(r => r.fulfilledSamples.some(s => s.id === sample.id));

                    return (
                      <div key={sample.id} className="sample-row" style={{ gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr 1fr', opacity: isAllocated ? 0.6 : 1 }}>
                        <span style={{ fontWeight: '600' }}>{sample.id}</span>
                        <span>{sample.gender} ({sample.age})</span>
                        <span style={{ fontSize: '11px' }}>{sample.cancerType.split(' ')[0]} {sample.cancerStage}</span>
                        <span>{sample.tissueType.split(' ')[0]}</span>
                        <span style={{ fontSize: '11px', color: sample.temp.includes('-') ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                          {sample.temp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
