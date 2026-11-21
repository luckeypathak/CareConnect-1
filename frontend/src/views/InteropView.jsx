import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function InteropView() {
  const [activeTab, setActiveTab] = useState('fhir');
  const [fhirResources, setFhirResources] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedFhir, setSelectedFhir] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fhirRes, auditRes] = await Promise.all([
        api.get('fhir-resources/'),
        api.get('audit-logs/')
      ]);
      setFhirResources(fhirRes.data.results || fhirRes.data);
      setAuditLogs(auditRes.data.results || auditRes.data);
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
          <span className="badge bg-secondary mb-1">Modules 8 & 9</span>
          <h3 className="fw-bold m-0 text-dark">Interoperability (HL7 FHIR) & System Security Audit</h3>
          <p className="text-muted small m-0">Healthcare data exchange standards & HIPAA-aligned tamper-evident audit trail</p>
        </div>

        {/* Tab Switcher */}
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${activeTab === 'fhir' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('fhir')}
          >
            <i className="bi bi-box-arrow-up-right"></i> FHIR R4 Resources ({fhirResources.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('audit')}
          >
            <i className="bi bi-shield-shaded"></i> Security Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* FHIR Resources Tab */}
      {activeTab === 'fhir' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3">
                <h6 className="fw-bold m-0 text-dark">Standardized HL7/FHIR R4 Payloads</h6>
              </div>
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-hover align-middle mb-0 custom-table">
                  <thead>
                    <tr>
                      <th>Resource ID</th>
                      <th>Type</th>
                      <th>Version</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center py-4 text-muted">Loading FHIR resources...</td></tr>
                    ) : fhirResources.map((res) => (
                      <tr key={res.id}>
                        <td className="fw-bold text-primary">{res.resource_id}</td>
                        <td><span className="badge bg-light text-dark border">{res.resource_type}</span></td>
                        <td><span className="badge bg-info-subtle text-info">{res.fhir_version}</span></td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedFhir(res)}
                          >
                            <i className="bi bi-code-slash"></i> Inspect JSON
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column: JSON payload viewer */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                <span className="fw-semibold small">
                  <i className="bi bi-braces"></i> FHIR R4 JSON Schema Inspector
                </span>
                {selectedFhir && (
                  <span className="badge bg-light text-dark">{selectedFhir.resource_id}</span>
                )}
              </div>
              <div className="card-body p-3 bg-light">
                {selectedFhir ? (
                  <pre className="m-0 p-3 bg-white rounded border" style={{ maxHeight: '520px', overflow: 'auto', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                    {typeof selectedFhir.json_payload === 'string' 
                      ? JSON.stringify(JSON.parse(selectedFhir.json_payload), null, 2)
                      : JSON.stringify(selectedFhir.json_payload, null, 2)}
                  </pre>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-arrow-left-circle fs-3 d-block mb-2"></i>
                    Select a FHIR resource on the left to inspect its compliant JSON payload.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Log #</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Target ID</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                  <th>Event Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>#{log.id}</td>
                    <td className="fw-semibold">{log.user_name}</td>
                    <td>
                      <span className={`badge ${
                        log.action === 'CREATE' ? 'badge-normal' :
                        log.action === 'UPDATE' ? 'badge-high' :
                        log.action === 'LOGIN' ? 'badge-info-custom' : 'bg-light text-secondary border'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td><span className="badge bg-light text-dark border">{log.entity_name}</span></td>
                    <td className="small text-muted">{log.entity_id}</td>
                    <td className="small font-monospace">{log.ip_address}</td>
                    <td className="small text-muted">{log.performed_at?.slice(0, 16).replace('T', ' ')}</td>
                    <td className="small text-muted" style={{ maxWidth: 280 }}>
                      <div className="text-truncate">{log.details}</div>
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
