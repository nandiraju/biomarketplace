import React, { useState } from 'react';
import { Wallet, ShieldCheck, Landmark, CreditCard, DollarSign, List, Table, Hash, Calendar, Clipboard, Globe, Activity, ArrowUpDown } from 'lucide-react';

export default function PaymentHub({ requests, sandboxFunds, setSandboxFunds, labEarnings }) {
  const [cardNumber, setCardNumber] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Math totals
  const totalDanaFarberEarnings = labEarnings['dana-farber'] || 0;
  const totalMdAndersonEarnings = labEarnings['md-anderson'] || 0;
  const totalMayoClinicEarnings = labEarnings['mayo-clinic'] || 0;
  const totalLabEarnings = totalDanaFarberEarnings + totalMdAndersonEarnings + totalMayoClinicEarnings;

  const totalUnpaid = requests
    .filter((r) => r.paymentStatus === 'Unpaid')
    .reduce((sum, r) => sum + r.budget, 0);

  const totalPaid = requests
    .filter((r) => r.paymentStatus === 'Paid')
    .reduce((sum, r) => sum + r.budget, 0);

  // Generate a direct payment ledger based on requests
  const getLedgerEntries = () => {
    const entries = [];

    requests.forEach((req, idx) => {
      if (req.paymentStatus === 'Paid') {
        const labCode = req.selectedLabId === 'dana-farber' ? 'DFCI Node' : req.selectedLabId === 'md-anderson' ? 'MDAB Node' : 'MCTH Node';
        entries.push({
          id: `TXN-${1000 + idx * 7}`,
          date: req.dateCreated,
          requestTitle: `Direct Payment: ${req.title}`,
          amount: req.budget,
          type: 'direct_payout',
          status: req.status === 'Delivered' ? 'Completed' : 'Processing Allocation',
          destination: labCode
        });
      } else {
        entries.push({
          id: `TXN-${1000 + idx * 7}`,
          date: req.dateCreated,
          requestTitle: `Awaiting Quotes: ${req.title}`,
          amount: req.budget,
          type: 'pending_quote',
          status: 'Awaiting Estimates',
          destination: 'Marketplace'
        });
      }
    });

    // Sort by id descending initially
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

  const handleAddFunds = (e) => {
    e.preventDefault();
    setSandboxFunds(sandboxFunds + 10000);
    setCardNumber('');
    setShowAddFunds(false);
  };

  return (
    <div>
      <div className="metrics-grid">
        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Sandbox Wallet</span>
            <span className="metric-value">${sandboxFunds.toLocaleString()}</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-teal)' }}>
            <Wallet size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Direct Paid to Biobanks</span>
            <span className="metric-value">${totalPaid.toLocaleString()}</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-indigo)' }}>
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Biobank Earnings</span>
            <span className="metric-value">${totalLabEarnings.toLocaleString()}</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent-emerald)' }}>
            <Landmark size={20} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-data">
            <span className="metric-label">Unpaid Requests Val</span>
            <span className="metric-value">${totalUnpaid.toLocaleString()}</span>
          </div>
          <div className="metric-icon-box">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      <div className="payment-flow-grid">
        {/* Left Side: Ledger */}
        <div className="glass-panel">
          <div className="panel-header">
            <h2>Financial Ledger</h2>
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
            {viewMode === 'table' ? (
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
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('destination')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={12} /> Destination <ArrowUpDown size={11} style={{ opacity: sortField === 'destination' ? 1 : 0.4 }} />
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
                      <td>{entry.destination}</td>
                      <td style={{ fontWeight: '600' }}>
                        {entry.type === 'direct_payout' ? (
                          <span style={{ color: 'var(--accent-emerald)' }}>-${entry.amount.toLocaleString()}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>${entry.amount.toLocaleString()}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          entry.type === 'direct_payout'
                            ? (entry.status === 'Completed' ? 'badge-success' : 'badge-progress')
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
                        entry.type === 'direct_payout'
                          ? (entry.status === 'Completed' ? 'badge-success' : 'badge-progress')
                          : 'badge-pending'
                      }`} style={{ fontSize: '9px' }}>
                        {entry.status}
                      </span>
                    </div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {entry.requestTitle}
                    </strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span>To: {entry.destination}</span>
                      <span>{entry.date}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '10px', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end', fontWeight: '700', fontSize: '14px' }}>
                      {entry.type === 'direct_payout' ? (
                        <span style={{ color: 'var(--accent-emerald)' }}>-${entry.amount.toLocaleString()}</span>
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

        {/* Right Side: Visualizer and Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Direct Payout Allocation Visualizer */}
          <div className="glass-panel">
            <div className="panel-header">
              <h2>Direct Payment Allocation</h2>
            </div>
            <div className="panel-body">
              <div className="escrow-diagram">
                <div className="escrow-labels">
                  <span>Marketplace Fund Split</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>
                    Total Handled: ${(totalPaid + totalUnpaid).toLocaleString()}
                  </span>
                </div>

                <div className="escrow-bar-container">
                  {totalPaid > 0 && (
                    <div 
                      className="escrow-bar-fill released" 
                      style={{ width: `${(totalPaid / (totalPaid + totalUnpaid || 1)) * 100}%` }}
                      title="Directly Paid to Biobanks"
                    ></div>
                  )}
                  {totalUnpaid > 0 && (
                    <div 
                      className="escrow-bar-fill funded" 
                      style={{ width: `${(totalUnpaid / (totalPaid + totalUnpaid || 1)) * 100}%`, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)' }}
                      title="Unpaid Request Budgets"
                    ></div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: 'var(--accent-emerald)', borderRadius: '2px' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Paid to Biobanks (${totalPaid.toLocaleString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', border: '1px solid var(--border-light)' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Awaiting Estimates / Unpaid (${totalUnpaid.toLocaleString()})</span>
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
                  <ShieldCheck size={16} style={{ color: 'var(--accent-teal)' }} />
                  <strong style={{ color: 'var(--text-primary)' }}>Direct Payout System Active</strong>
                </div>
                <p>
                  Funds are transferred directly from the sponsor's sandbox wallet to the selected biobank upon quote acceptance. All transactions are written instantly to the history audit ledger for full financial compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Sandbox Fund Refill */}
          <div className="glass-panel">
            <div className="panel-header">
              <h2>Refill Sandbox Wallet</h2>
            </div>
            <div className="panel-body">
              {showAddFunds ? (
                <form onSubmit={handleAddFunds}>
                  <div className="form-group">
                    <label className="form-label">Mock Card Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      maxLength="19" 
                      placeholder="4000 1234 5678 9010" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      required 
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input type="text" className="form-input" placeholder="MM/YY" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVC</label>
                      <input type="password" className="form-input" maxLength="3" placeholder="***" required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddFunds(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                      Add $10,000 Sandbox
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Add test funds to researcher wallet</span>
                    <strong style={{ display: 'block', fontSize: '18px', marginTop: '4px' }}>+$10,000.00 USD</strong>
                  </div>
                  <button className="btn btn-primary" onClick={() => setShowAddFunds(true)}>
                    <CreditCard size={16} /> Add Sandbox Card
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
