import React, { useState } from 'react';
import api from '../services/api';

export default function DashboardView({ stats, onNavigate, refreshStats }) {
  const [selectedPatientId, setSelectedPatientId] = useState('1');
  const [testDrug, setTestDrug] = useState('Augmentin 625 Duo');
  const [interactionResult, setInteractionResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const handleTestInteraction = async (e) => {
    e.preventDefault();
    setEvaluating(true);
    try {
      const res = await api.post('cds/check-interaction/', {
        patient_id: selectedPatientId,
        drug_name: testDrug
      });
      setInteractionResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold m-0 text-dark">Clinical Operations Dashboard</h3>
          <p className="text-muted small m-0">Electronic Health Record (EHR) Real-time System Metrics</p>
        </div>
        <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={refreshStats}>
          <i className="bi bi-arrow-clockwise"></i> Refresh Data
        </button>
      </div>

      {/* Top 4 KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Total Patients</span>
              <h2 className="fw-bold my-1 text-dark">{stats?.total_patients || 0}</h2>
              <span className="badge bg-light text-success fw-normal"><i className="bi bi-check-circle"></i> Registered in MySQL</span>
            </div>
            <div className="icon-box bg-primary-subtle text-primary">
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Clinical Encounters</span>
              <h2 className="fw-bold my-1 text-dark">{stats?.total_encounters || 0}</h2>
              <span className="badge bg-light text-primary fw-normal">OPD, IPD & Triage</span>
            </div>
            <div className="icon-box bg-info-subtle text-info">
              <i className="bi bi-journal-medical"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Active Prescriptions</span>
              <h2 className="fw-bold my-1 text-dark">{stats?.active_prescriptions || 0}</h2>
              <span className="badge bg-light text-secondary fw-normal">Ongoing Therapies</span>
            </div>
            <div className="icon-box bg-success-subtle text-success">
              <i className="bi bi-capsule"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">CDS Safety Alerts</span>
              <h2 className="fw-bold my-1 text-danger">{stats?.active_cds_alerts || 0}</h2>
              <span className="badge bg-danger-subtle text-danger fw-semibold">Clinical Support Active</span>
            </div>
            <div className="icon-box bg-danger-subtle text-danger">
              <i className="bi bi-shield-exclamation"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive CDS Safety Evaluation Sandbox */}
      <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)', border: '1px solid #bae6fd' }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary px-3 py-1">Module 6: Live Clinical Decision Support</span>
            <span className="text-muted small">Real-time Patient Allergy & Drug Interaction Detection</span>
          </div>
          <h5 className="fw-bold text-dark">EHR Drug-Safety Evaluation Simulator</h5>
          <p className="text-muted small">
            Select a patient and a candidate medication to test real-time allergy cross-referencing and contraindication warnings before prescribing.
          </p>

          <form onSubmit={handleTestInteraction} className="row g-2 align-items-center">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Select Registered Patient:</label>
              <select className="form-select" value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)}>
                <option value="1">Rohit Mehta (Allergic to Penicillin)</option>
                <option value="4">Meera Iyer (Allergic to Aspirin)</option>
                <option value="3">Amitabh Joshi (Allergic to Sulfa)</option>
                <option value="10">Vikramaditya Rao (Severe Ibuprofen Sensitivity)</option>
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted">Test Medication to Prescribe:</label>
              <select className="form-select" value={testDrug} onChange={(e) => setTestDrug(e.target.value)}>
                <option value="Augmentin 625 Duo">Augmentin 625 Duo (Amoxicillin - Beta-lactam)</option>
                <option value="Clexane 40mg">Clexane 40mg (Enoxaparin Sodium - Anticoagulant)</option>
                <option value="Combiflam">Combiflam (Ibuprofen + Paracetamol - NSAID)</option>
                <option value="Paracip 650">Paracip 650 (Paracetamol - Safe Alternative)</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={evaluating}>
                {evaluating ? 'Evaluating...' : '⚡ Run Safety Check'}
              </button>
            </div>
          </form>

          {interactionResult && (
            <div className="mt-3">
              {interactionResult.safe ? (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-0 py-2">
                  <i className="bi bi-shield-check fs-4"></i>
                  <div>
                    <strong>Safe to Prescribe:</strong> No active allergen conflict or lethal drug-drug interactions detected for this patient.
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {interactionResult.warnings.map((w, idx) => (
                    <div key={idx} className={`alert ${w.severity === 'CRITICAL' ? 'alert-danger' : 'alert-warning'} mb-0 py-2 d-flex align-items-start gap-2`}>
                      <i className="bi bi-exclamation-triangle-fill fs-5 mt-1"></i>
                      <div>
                        <strong>[{w.severity}] {w.type}:</strong> {w.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent Encounters & Active Alerts */}
      <div className="row g-4">
        {/* Recent Encounters */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold m-0 text-dark">Recent Clinical Encounters</h6>
              <button className="btn btn-sm btn-link text-decoration-none" onClick={() => onNavigate('encounters')}>
                View All <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Encounter #</th>
                    <th>Patient</th>
                    <th>Provider</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_encounters?.map((enc) => (
                    <tr key={enc.id}>
                      <td className="fw-semibold text-primary">{enc.encounter_number}</td>
                      <td>{enc.patient_name}</td>
                      <td className="small">{enc.provider_name}</td>
                      <td><span className="badge bg-light text-dark border">{enc.encounter_type}</span></td>
                      <td><span className="badge bg-success-subtle text-success">{enc.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active CDS Alerts Feed */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold m-0 text-dark">Clinical Decision Alerts</h6>
              <button className="btn btn-sm btn-link text-decoration-none" onClick={() => onNavigate('cds')}>
                View All <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <div className="p-3 d-flex flex-column gap-2" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {stats?.recent_alerts?.map((alert) => (
                <div key={alert.id} className="p-3 rounded border" style={{ backgroundColor: alert.severity === 'CRITICAL' ? '#fff5f5' : '#fffbeb' }}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className={`badge ${alert.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                      {alert.severity}
                    </span>
                    <small className="text-muted">{alert.triggered_at?.slice(0, 10)}</small>
                  </div>
                  <div className="fw-bold small text-dark">{alert.alert_title}</div>
                  <div className="small text-secondary mt-1">{alert.alert_message}</div>
                  <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                    Patient: <strong>{alert.patient_name}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
