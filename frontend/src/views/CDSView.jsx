import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CDSView() {
  const [rules, setRules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rulesRes, alertsRes] = await Promise.all([
        api.get('cds-rules/'),
        api.get('cds-alerts/')
      ]);
      setRules(rulesRes.data.results || rulesRes.data);
      setAlerts(alertsRes.data.results || alertsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-danger-subtle text-danger mb-1">Module 6</span>
          <h3 className="fw-bold m-0 text-dark">Clinical Decision Support (CDS)</h3>
          <p className="text-muted small m-0">Evidence-based algorithmic safety checks, interaction warnings & vital alerts</p>
        </div>

        {/* Tab Switcher */}
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${activeTab === 'alerts' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setActiveTab('alerts')}
          >
            <i className="bi bi-bell-fill"></i> Triggered Alerts ({alerts.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'rules' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setActiveTab('rules')}
          >
            <i className="bi bi-gear-wide-connected"></i> Rule Repository ({rules.length})
          </button>
        </div>
      </div>

      {/* Triggered Alerts View */}
      {activeTab === 'alerts' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Alert Title</th>
                  <th>Affected Patient</th>
                  <th>Clinical Advisory</th>
                  <th>Timestamp</th>
                  <th>Physician Acknowledged</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">Loading CDS alerts...</td></tr>
                ) : alerts.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <span className={`badge ${
                        a.severity === 'CRITICAL' ? 'badge-critical' :
                        a.severity === 'HIGH' ? 'badge-high' : 'badge-medium'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="fw-bold text-dark">{a.alert_title}</td>
                    <td className="fw-semibold text-primary">{a.patient_name}</td>
                    <td className="small" style={{ maxWidth: 280 }}>
                      <div className="text-muted">{a.alert_message}</div>
                    </td>
                    <td className="small text-muted">{a.triggered_at?.slice(0, 16).replace('T', ' ')}</td>
                    <td className="small text-success">
                      <i className="bi bi-check-circle-fill"></i> {a.acknowledgement_notes || 'Reviewed by Physician'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rules Repository View */}
      {activeTab === 'rules' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Rule Code</th>
                  <th>Rule Title</th>
                  <th>Category</th>
                  <th>Default Severity</th>
                  <th>Rule Logic / Clinical Guideline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-bold text-secondary">{r.rule_code}</td>
                    <td className="fw-semibold text-dark">{r.title}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{r.rule_category}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        r.severity_level === 'CRITICAL' ? 'badge-critical' :
                        r.severity_level === 'HIGH' ? 'badge-high' : 'badge-medium'
                      }`}>
                        {r.severity_level}
                      </span>
                    </td>
                    <td className="small text-muted" style={{ maxWidth: 300 }}>
                      {r.description}
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success">Active In Engine</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
