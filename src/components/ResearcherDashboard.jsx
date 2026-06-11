import React, { useState } from 'react';
import { FILTER_OPTIONS, MOCK_INVENTORIES } from '../data/mockData';
import { Plus, Search, FileText, CheckCircle2, ShieldCheck, DollarSign, List, Table, ArrowUpDown, Hash, Clipboard, Calendar, Dna, User, Globe, Layers, Activity, X } from 'lucide-react';

export default function ResearcherDashboard({ requests, setRequests, sandboxFunds, setSandboxFunds, labEarnings, setLabEarnings, shipments, setShipments }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetQuantity, setTargetQuantity] = useState(5);
  const [budget, setBudget] = useState(15000);
  const [viewMode, setViewMode] = useState('table');
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRequestForEstimates, setSelectedRequestForEstimates] = useState(null);
  const [criteria, setCriteria] = useState({
    gender: 'Female',
    ageGroup: '36-50',
    cancerType: 'Breast Cancer',
    cancerStage: 'Stage III',
    demography: 'Caucasian',
    tissueType: 'Fresh Frozen (FF)'
  });

  // Handle Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const newRequest = {
      id: `REQ-${Date.now().toString().slice(-3)}`,
      title,
      researcherName: 'Dr. Sarah Jenkins',
      institution: 'Broad Institute',
      dateCreated: new Date().toISOString().split('T')[0],
      criteria: { ...criteria },
      targetQuantity: Number(targetQuantity),
      budget: Number(budget),
      status: 'Awaiting Estimates',
      paymentStatus: 'Unpaid',
      selectedLabId: null,
      estimates: [],
      fulfilledSamples: []
    };

    setRequests([newRequest, ...requests]);
    setTitle('');
    setShowForm(false);
  };

  // Handle direct payment to biobank
  const payBiobankDirectly = (requestId, estimate) => {
    if (sandboxFunds < estimate.price) {
      alert(`Insufficient sandbox funds. You have $${sandboxFunds.toLocaleString()}, but this estimate requires $${estimate.price.toLocaleString()}. Refill your sandbox wallet in the Ledger tab.`);
      return;
    }

    // Deduct funds from researcher
    setSandboxFunds(sandboxFunds - estimate.price);

    // Add earnings to the biobank
    setLabEarnings({
      ...labEarnings,
      [estimate.labId]: (labEarnings[estimate.labId] || 0) + estimate.price
    });

    const activeLabInventory = MOCK_INVENTORIES[estimate.labId] || [];
    
    // Create the request's fulfilled samples array
    const fulfilledSamples = (estimate.sampleIds || []).map((id) => {
      const sample = activeLabInventory.find((s) => s.id === id) || {
        id: id,
        gender: 'Female',
        age: 45,
        cancerType: 'Breast Cancer',
        cancerStage: 'Stage III',
        demography: 'African American',
        tissueType: 'Fresh Frozen (FF)',
        rinScore: 8.2
      };
      
      return {
        id: sample.id,
        labId: estimate.labId,
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

    // Update requests state
    const targetRequest = requests.find(r => r.id === requestId);
    setRequests(
      requests.map((req) => {
        if (req.id === requestId) {
          const isFullyFulfilled = fulfilledSamples.length >= req.targetQuantity;
          return {
            ...req,
            status: isFullyFulfilled ? 'Fully Fulfilled' : 'Paid & Processing',
            paymentStatus: 'Paid',
            selectedLabId: estimate.labId,
            budget: estimate.price, // agreed price
            fulfilledSamples: fulfilledSamples
          };
        }
        return req;
      })
    );

    // Create automatic iTracker shipments
    const labCode = estimate.labId === 'dana-farber' ? 'DFCI' : estimate.labId === 'md-anderson' ? 'MDAB' : 'MCTH';
    const newShipments = fulfilledSamples.map((sample) => {
      return {
        id: sample.shipmentId,
        requestId: requestId,
        requestTitle: targetRequest?.title || 'Cohort Specimen',
        sampleId: sample.id,
        labId: estimate.labId,
        carrier: 'BioExpress Logistics',
        trackingNumber: `BIO-${labCode}-${Date.now().toString().slice(-4)}-${sample.id.split('-').pop()}`,
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

    setSelectedRequestForEstimates(null);
    alert(`Success! Direct payment of $${estimate.price.toLocaleString()} transferred to the biobank.`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Awaiting Estimates':
        return 'badge-pending';
      case 'Paid & Processing':
        return 'badge-progress';
      case 'Fully Fulfilled':
      case 'Delivered':
        return 'badge-success';
      default:
        return 'badge-progress';
    }
  };

  // Compute metrics
  const activeRequests = requests.length;
  const paidAmount = requests
    .filter((r) => r.paymentStatus === 'Paid')
    .reduce((sum, r) => sum + r.budget, 0);
  const totalSamplesRequested = requests.reduce((sum, r) => sum + r.targetQuantity, 0);
  const totalSamplesFulfilled = requests.reduce((sum, r) => sum + r.fulfilledSamples.length, 0);

  return (
    <div>
      <div className="metrics-grid">
        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Active Requests</span>
            <span className="metric-value">{activeRequests}</span>
          </div>
          <div className="metric-icon-box">
            <FileText size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Direct Payments Made</span>
            <span className="metric-value">${paidAmount.toLocaleString()}</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-teal)' }}>
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Samples Requested</span>
            <span className="metric-value">{totalSamplesRequested}</span>
          </div>
          <div className="metric-icon-box">
            <Search size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Samples Secured</span>
            <span className="metric-value">{totalSamplesFulfilled} / {totalSamplesRequested}</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Requests List */}
        <div className="glass-panel">
          <div className="panel-header">
            <h2>Active Biosample Inquiries</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {!showForm && (
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
              )}
              {!showForm && (
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  <Plus size={16} /> Create Request Task
                </button>
              )}
            </div>
          </div>

          <div className="panel-body">
            {showForm ? (
              <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Define Cohort Criteria</h3>
                
                <div className="form-group">
                  <label className="form-label">Study / Cohort Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Stage III Melanoma Female Cohort" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cancer Type</label>
                    <select 
                      className="form-select" 
                      value={criteria.cancerType}
                      onChange={(e) => setCriteria({ ...criteria, cancerType: e.target.value })}
                    >
                      {FILTER_OPTIONS.cancerTypes.filter(t => t !== 'All').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cancer Stage</label>
                    <select 
                      className="form-select"
                      value={criteria.cancerStage}
                      onChange={(e) => setCriteria({ ...criteria, cancerStage: e.target.value })}
                    >
                      {FILTER_OPTIONS.cancerStages.filter(s => s !== 'All').map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select 
                      className="form-select"
                      value={criteria.gender}
                      onChange={(e) => setCriteria({ ...criteria, gender: e.target.value })}
                    >
                      {FILTER_OPTIONS.genders.filter(g => g !== 'All').map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age Group</label>
                    <select 
                      className="form-select"
                      value={criteria.ageGroup}
                      onChange={(e) => setCriteria({ ...criteria, ageGroup: e.target.value })}
                    >
                      {FILTER_OPTIONS.ageGroups.filter(a => a !== 'All').map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Demography</label>
                    <select 
                      className="form-select"
                      value={criteria.demography}
                      onChange={(e) => setCriteria({ ...criteria, demography: e.target.value })}
                    >
                      {FILTER_OPTIONS.demographies.filter(d => d !== 'All').map(dem => (
                        <option key={dem} value={dem}>{dem}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tissue Type</label>
                    <select 
                      className="form-select"
                      value={criteria.tissueType}
                      onChange={(e) => setCriteria({ ...criteria, tissueType: e.target.value })}
                    >
                      {FILTER_OPTIONS.tissueTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Target Quantity</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1" 
                      max="100" 
                      value={targetQuantity} 
                      onChange={(e) => setTargetQuantity(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Research Budget ($)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      step="500" 
                      value={budget} 
                      onChange={(e) => setBudget(e.target.value)} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Publish Request</button>
                </div>
              </form>
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
                          <Clipboard size={13} /> Cohort Study Title <ArrowUpDown size={12} style={{ opacity: sortField === 'title' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('dateCreated')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={13} /> Date <ArrowUpDown size={12} style={{ opacity: sortField === 'dateCreated' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('targetQuantity')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Dna size={13} /> Fulfillment <ArrowUpDown size={12} style={{ opacity: sortField === 'targetQuantity' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('budget')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <DollarSign size={13} /> Budget <ArrowUpDown size={12} style={{ opacity: sortField === 'budget' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ cursor: 'pointer', padding: '12px' }} onClick={() => handleSort('status')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Activity size={13} /> Status <ArrowUpDown size={12} style={{ opacity: sortField === 'status' ? 1 : 0.4 }} />
                        </div>
                      </th>
                      <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ fontWeight: '600', color: 'var(--accent-teal)', padding: '12px' }}>{req.id}</td>
                        <td style={{ padding: '12px' }}>
                          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{req.title}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {req.criteria.gender} • {req.criteria.ageGroup} • {req.criteria.cancerType} ({req.criteria.cancerStage}) • {req.criteria.tissueType}
                          </span>
                        </td>
                        <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>{req.dateCreated}</td>
                        <td style={{ padding: '12px' }}>{req.fulfilledSamples.length} / {req.targetQuantity}</td>
                        <td style={{ padding: '12px', fontWeight: '600' }}>${req.budget.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge ${getStatusBadgeClass(req.status)}`} style={{ fontSize: '9px' }}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {req.paymentStatus === 'Unpaid' ? (
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => setSelectedRequestForEstimates(req)}
                            >
                              <DollarSign size={11} /> View Estimates ({req.estimates?.length || 0})
                            </button>
                          ) : req.status === 'Delivered' ? (
                            <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: '600' }}>Delivered & Settled</span>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--accent-indigo)', fontWeight: '600' }}>Paid Direct</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="requests-list">
                {sortedRequests.map((req) => (
                  <div key={req.id} className="item-card">
                    <div className="item-card-header">
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: '600' }}>{req.id}</span>
                        <div className="item-title" style={{ marginTop: '2px', fontSize: '16px' }}>{req.title}</div>
                        <div className="item-subtitle">Published on {req.dateCreated} • By {req.researcherName} ({req.institution})</div>
                      </div>
                      <div className={`badge ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </div>
                    </div>

                    <div className="item-card-body">
                      <div className="attributes-grid">
                        <div className="attribute-box">
                          <div className="attribute-label">Cancer Type</div>
                          <div className="attribute-value">{req.criteria.cancerType}</div>
                        </div>
                        <div className="attribute-box">
                          <div className="attribute-label">Stage</div>
                          <div className="attribute-value">{req.criteria.cancerStage}</div>
                        </div>
                        <div className="attribute-box">
                          <div className="attribute-label">Gender / Age</div>
                          <div className="attribute-value">{req.criteria.gender} • {req.criteria.ageGroup}</div>
                        </div>
                        <div className="attribute-box">
                          <div className="attribute-label">Demography</div>
                          <div className="attribute-value">{req.criteria.demography}</div>
                        </div>
                        <div className="attribute-box">
                          <div className="attribute-label">Tissue Type</div>
                          <div className="attribute-value">{req.criteria.tissueType}</div>
                        </div>
                      </div>

                      {req.fulfilledSamples.length > 0 && (
                        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                            Fulfilled Samples ({req.fulfilledSamples.length} of {req.targetQuantity})
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                            {req.fulfilledSamples.map(sample => (
                              <div key={sample.id} style={{ 
                                background: 'rgba(16, 185, 129, 0.1)', 
                                border: '1px solid rgba(16, 185, 129, 0.2)', 
                                padding: '4px 8px', 
                                borderRadius: '6px',
                                fontSize: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold' }}>{sample.id}</span>
                                <span style={{ color: 'var(--text-muted)' }}>({sample.labId === 'dana-farber' ? 'DFCI' : sample.labId === 'md-anderson' ? 'MDAB' : 'MCTH'})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="item-card-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Direct Budget: <strong style={{ color: 'var(--text-primary)' }}>${req.budget.toLocaleString()}</strong>
                        </span>
                        <span className={`badge ${req.paymentStatus === 'Paid' ? 'badge-success' : 'badge-pending'}`} style={{ fontSize: '9px' }}>
                          {req.paymentStatus}
                        </span>
                      </div>

                      {req.paymentStatus === 'Unpaid' && (
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setSelectedRequestForEstimates(req)}
                        >
                          <DollarSign size={14} /> View Estimates ({req.estimates?.length || 0})
                        </button>
                      )}
                      {req.paymentStatus === 'Paid' && req.status === 'Paid & Processing' && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Awaiting Specimen Allocation
                        </span>
                      )}
                      {req.status === 'Delivered' && (
                        <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                          ✓ Delivered & Settled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Informational Sidebar */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: 'var(--accent-teal)' }} /> Direct Flow Governance
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
            The iCore Federated Biobank marketplace directly links research sponsors and clinical repository networks.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-teal)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 'bold', justifyContent: 'center' }}>1</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Create Inquiry:</strong> Researchers define clinical criteria for desired cohort study lines.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-teal)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 'bold', justifyContent: 'center' }}>2</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Quote Submission:</strong> Biobanks verify their LIMS inventory and submit custom pricing quotes.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-teal)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 'bold', justifyContent: 'center' }}>3</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Direct Settlement:</strong> Researcher accepts a quote, paying the biobank directly. This updates the status to Paid & Processing.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-teal)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 'bold', justifyContent: 'center' }}>4</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Allocation & Tracking:</strong> Biobank finishes barcoding, LIMS QC checks, and carrier handover for tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estimates Modal Overlay */}
      {selectedRequestForEstimates && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(9, 13, 22, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            padding: '30px',
            width: '90%',
            maxWidth: '550px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-glass), var(--shadow-glow)',
            position: 'relative'
          }}>
            <button 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setSelectedRequestForEstimates(null)}
            >
              <X size={18} />
            </button>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Biobank Price Estimates
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Select a quote from a certified partner biobank. Accepting will trigger a direct payment.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
              {(selectedRequestForEstimates.estimates || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No estimates submitted by biobanks yet. Log in to the Biobank Portal as a partner lab to submit a price quote for this request.
                </div>
              ) : (
                (selectedRequestForEstimates.estimates || []).map((estimate, index) => {
                  const labName = estimate.labId === 'dana-farber' ? 'Dana-Farber (DFCI)' : estimate.labId === 'md-anderson' ? 'MD Anderson (MDAB)' : 'Mayo Clinic (MCTH)';
                  return (
                    <div key={index} style={{
                      background: 'rgba(26, 54, 93, 0.03)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1, paddingRight: '12px' }}>
                        <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)' }}>{labName}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                          Fulfilling: <strong>{estimate.samplesCount}</strong> samples
                        </span>
                        {estimate.notes && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>
                            "{estimate.notes}"
                          </span>
                        )}
                        {estimate.sampleIds && estimate.sampleIds.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                              Proposed Specimen Codes:
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                              {estimate.sampleIds.map(id => (
                                <code key={id} style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-teal)' }}>
                                  {id}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent-teal)' }}>
                          ${estimate.price.toLocaleString()}
                        </span>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '12px', minHeight: 'auto' }}
                          onClick={() => payBiobankDirectly(selectedRequestForEstimates.id, estimate)}
                        >
                          Accept & Pay
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedRequestForEstimates(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
