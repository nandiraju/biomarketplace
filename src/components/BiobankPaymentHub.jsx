import React, { useState } from 'react';
import { Landmark, ShieldCheck, DollarSign, List, Table, Hash, Calendar, Clipboard, Globe, Activity, ArrowUpDown, LandmarkIcon } from 'lucide-react';

export default function BiobankPaymentHub({ requests, labEarnings, loggedInLabId }) {
  const [viewMode, setViewMode] = useState('table');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  const getLabName = (labId) => {
    switch (labId) {
      case 'dana-farber': return 'Dana-Farber (DFCI)';
      case 'md-anderson': return 'MD Anderson (MDAB)';
      case 'mayo-clinic': return 'Mayo Clinic (MCTH)';
      default: return labId;
    }
  };

  const getLabCode = (labId) => {
    switch (labId) {
      case 'dana-farber': return 'DFCI Node';
      case 'md-anderson': return 'MDAB Node';
      case 'mayo-clinic': return 'MCTH Node';
      default: return 'Node';
    }
  };

  // 1. Lab specific earnings
  const nodeEarnings = labEarnings[loggedInLabId] || 0;

  // 2. Count of cohorts this lab has fulfilled/allocated (Paid status and selected lab is this lab)
  const labAllocations = requests.filter((r) => r.selectedLabId === loggedInLabId && r.paymentStatus === 'Paid');
  const totalAllocationsCount = labAllocations.length;

  // 3. Outstanding quotes value: requests that are awaiting estimates where this lab submitted an estimate
  const outstandingQuotesVal = requests
    .filter((r) => r.status === 'Awaiting Estimates' && r.estimates?.some(e => e.labId === loggedInLabId))
    .reduce((sum, r) => {
      const est = r.estimates.find(e => e.labId === loggedInLabId);
      return sum + (est?.price || r.budget);
    }, 0);

  // Generate a lab-specific direct payment ledger based on requests
  const getLedgerEntries = () => {
    const entries = [];

    requests.forEach((req, idx) => {
      // Show paid entries specifically allocated to this lab
      if (req.paymentStatus === 'Paid' && req.selectedLabId === loggedInLabId) {
        entries.push({
          id: `TXN-${1000 + idx * 7}`,
          date: req.dateCreated,
          requestTitle: `Direct Payout: ${req.title}`,
          amount: req.budget,
          type: 'received',
          status: req.status === 'Delivered' ? 'Settled' : 'In Transit',
          source: 'Marketplace Sponsor'
        });
      }
      
      // Also show pending quotes submitted by this lab
      const myEstimate = req.estimates?.find((e) => e.labId === loggedInLabId);
      if (req.status === 'Awaiting Estimates' && myEstimate) {
        entries.push({
          id: `TXN-${1000 + idx * 7}`,
          date: req.dateCreated,
          requestTitle: `Quote Published: ${req.title}`,
          amount: myEstimate.price,
          type: 'quoted',
          status: 'Awaiting Decision',
          source: 'Marketplace Inquiry'
        });
      }
    });

    return entries.sort((a, b) => b.id.localeCompare(a.id));
  };

  const ledger = getLedgerEntries();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLedger = [...ledger].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'amount') {
      aVal = a.amount;
      bVal = b.amount;
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
    <div>
      {/* Biobank Earnings Metrics */}
      <div className="metrics-grid">
        <div className="glass-panel metric-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div className="metric-data">
            <span className="metric-label">{getLabCode(loggedInLabId)} Total Revenue</span>
            <span className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
              ${nodeEarnings.toLocaleString()}
            </span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-emerald)' }}>
            <Landmark size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Allocated Cohorts</span>
            <span className="metric-value">{totalAllocationsCount} Fulfillments</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-indigo)' }}>
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Active Published Quotes</span>
            <span className="metric-value">${outstandingQuotesVal.toLocaleString()}</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-teal)' }}>
            <DollarSign size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Node Settlement Status</span>
            <span className="metric-value">Active & Compliant</span>
          </div>
          <div className="metric-icon-box">
            <Activity size={20} />
          </div>
        </div>
      </div>

      <div className="payment-flow-grid">
        {/* Left Side: Ledger */}
        <div className="glass-panel">
          <div className="panel-header">
            <h2>Node Ledger - {getLabName(loggedInLabId).split(' ')[0]}</h2>
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
          <div className="panel-body" style={{ overflowX: 'auto' }}>
            {ledger.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No payout transactions or active estimates registered for this laboratory node.
              </div>
            ) : viewMode === 'table' ? (
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Hash size={12} style={{ color: 'var(--accent-teal)' }} /> TXN ID <ArrowUpDown size={11} style={{ opacity: sortField === 'id' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> Date <ArrowUpDown size={11} style={{ opacity: sortField === 'date' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('requestTitle')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clipboard size={12} /> Description <ArrowUpDown size={11} style={{ opacity: sortField === 'requestTitle' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('source')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={12} /> Source Node <ArrowUpDown size={11} style={{ opacity: sortField === 'source' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={12} /> Amount <ArrowUpDown size={11} style={{ opacity: sortField === 'amount' ? 1 : 0.4 }} />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={12} /> Status <ArrowUpDown size={11} style={{ opacity: sortField === 'status' ? 1 : 0.4 }} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLedger.map((entry) => (
                    <tr key={entry.id}>
                      <td><code style={{ color: 'var(--accent-teal)' }}>{entry.id}</code></td>
                      <td>{entry.date}</td>
                      <td>{entry.requestTitle}</td>
                      <td>{entry.source}</td>
                      <td style={{ fontWeight: '600' }}>
                        {entry.type === 'received' ? (
                          <span style={{ color: 'var(--accent-emerald)' }}>+${entry.amount.toLocaleString()}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>${entry.amount.toLocaleString()}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          entry.type === 'received'
                            ? (entry.status === 'Settled' ? 'badge-success' : 'badge-progress')
                            : 'badge-pending'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="requests-list">
                {sortedLedger.map((entry) => (
                  <div key={entry.id} className="item-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <code style={{ color: 'var(--accent-teal)', fontSize: '12px', fontWeight: 'bold' }}>{entry.id}</code>
                      <span className={`badge ${
                        entry.type === 'received'
                          ? (entry.status === 'Settled' ? 'badge-success' : 'badge-progress')
                          : 'badge-pending'
                      }`} style={{ fontSize: '9px' }}>
                        {entry.status}
                      </span>
                    </div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {entry.requestTitle}
                    </strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span>Source: {entry.source}</span>
                      <span>{entry.date}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '10px', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end', fontWeight: '700', fontSize: '14px' }}>
                      {entry.type === 'received' ? (
                        <span style={{ color: 'var(--accent-emerald)' }}>+${entry.amount.toLocaleString()}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>${entry.amount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visualizer and Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Node Earnings Allocation Diagram */}
          <div className="glass-panel">
            <div className="panel-header">
              <h2>Revenue Allocation Split</h2>
            </div>
            <div className="panel-body">
              <div className="escrow-diagram">
                <div className="escrow-labels">
                  <span>Allocation Split (Settled vs Quoted)</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>
                    Total Volume: ${(nodeEarnings + outstandingQuotesVal).toLocaleString()}
                  </span>
                </div>

                <div className="escrow-bar-container">
                  {nodeEarnings > 0 && (
                    <div 
                      className="escrow-bar-fill released" 
                      style={{ width: `${(nodeEarnings / (nodeEarnings + outstandingQuotesVal || 1)) * 100}%`, background: 'var(--accent-emerald)' }}
                      title="Settled Revenue"
                    ></div>
                  )}
                  {outstandingQuotesVal > 0 && (
                    <div 
                      className="escrow-bar-fill funded" 
                      style={{ width: `${(outstandingQuotesVal / (nodeEarnings + outstandingQuotesVal || 1)) * 100}%`, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)' }}
                      title="Quoted Estimates"
                    ></div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: 'var(--accent-emerald)', borderRadius: '2px' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Settled Revenue (${nodeEarnings.toLocaleString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', border: '1px solid var(--border-light)' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Quoted Inquiries (${outstandingQuotesVal.toLocaleString()})</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid var(--border-light)', 
                paddingTop: '20px', 
                marginTop: '20px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <LandmarkIcon size={16} style={{ color: 'var(--accent-teal)' }} />
                  <strong style={{ color: 'var(--text-primary)' }}>Laboratory Direct Payout Agreement</strong>
                </div>
                <p>
                  Payouts are received directly into your node's digital wallet immediately upon quote acceptance by the research sponsor. The funds are cleared and settled for specimen processing, dry ice packaging, and courier dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
