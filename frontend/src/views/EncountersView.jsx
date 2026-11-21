import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function EncountersView() {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnc, setSelectedEnc] = useState(null);

  const fetchEncounters = async () => {
    setLoading(true);
    try {
      const res = await api.get('encounters/');
      setEncounters(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncounters();
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-info-subtle text-info mb-1">Module 2</span>
          <h3 className="fw-bold m-0 text-dark">Clinical Documentation & Encounters</h3>
          <p className="text-muted small m-0">Electronic Medical Records, SOAP progress notes, ICD-10 diagnoses & vitals</p>
        </div>
      </div>

      {/* Encounters Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th>Encounter #</th>
                <th>Patient</th>
                <th>Attending Doctor</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Chief Complaint</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">Loading clinical encounters...</td></tr>
              ) : encounters.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No encounters recorded.</td></tr>
              ) : (
                encounters.map((enc) => (
                  <tr key={enc.id}>
                    <td className="fw-bold text-primary">{enc.encounter_number}</td>
                    <td><div className="fw-semibold">{enc.patient_name}</div></td>
                    <td>{enc.provider_name}</td>
                    <td><span className="badge bg-light text-dark border">{enc.encounter_type}</span></td>
                    <td className="small text-muted">{enc.encounter_date?.slice(0, 16).replace('T', ' ')}</td>
                    <td className="small" style={{ maxWidth: 260 }}>
                      <div className="text-truncate">{enc.chief_complaint}</div>
                    </td>
                    <td><span className="badge bg-success-subtle text-success">{enc.status}</span></td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setSelectedEnc(enc)}
                      >
                        <i className="bi bi-file-earmark-medical"></i> Clinical Note
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Encounter SOAP Modal */}
      {selectedEnc && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom py-3">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Clinical Encounter Summary: {selectedEnc.encounter_number}</h5>
                  <div className="small text-muted">
                    {selectedEnc.patient_name} • {selectedEnc.provider_name} • {selectedEnc.encounter_type}
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelectedEnc(null)}></button>
              </div>
              <div className="modal-body p-4">
                {/* SOAP Note Structure */}
                <div className="mb-3">
                  <h6 className="fw-bold text-primary"><i className="bi bi-person-lines-fill"></i> Subjective (S)</h6>
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-1"><strong>Chief Complaint:</strong> {selectedEnc.chief_complaint}</p>
                    <p className="mb-0 text-muted small"><strong>History of Present Illness:</strong> {selectedEnc.history_of_present_illness || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold text-primary"><i className="bi bi-clipboard2-pulse"></i> Objective (O) - Examination & Vitals</h6>
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-2"><strong>Physical Exam:</strong> {selectedEnc.examination_findings || 'Standard physical examination completed.'}</p>
                    {selectedEnc.vitals?.length > 0 && (
                      <div className="row g-2 text-center mt-1">
                        <div className="col-3">
                          <div className="p-2 bg-white rounded border">
                            <small className="text-muted d-block">Blood Pressure</small>
                            <strong>{selectedEnc.vitals[0].systolic_bp}/{selectedEnc.vitals[0].diastolic_bp} mmHg</strong>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 bg-white rounded border">
                            <small className="text-muted d-block">Heart Rate</small>
                            <strong>{selectedEnc.vitals[0].heart_rate} bpm</strong>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 bg-white rounded border">
                            <small className="text-muted d-block">Temperature</small>
                            <strong>{selectedEnc.vitals[0].temperature_f} °F</strong>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2 bg-white rounded border">
                            <small className="text-muted d-block">SpO2</small>
                            <strong>{selectedEnc.vitals[0].oxygen_saturation}%</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold text-primary"><i className="bi bi-tag-fill"></i> Assessment (A) - Diagnoses</h6>
                  <div className="p-3 bg-light rounded border">
                    {selectedEnc.diagnoses?.length > 0 ? (
                      selectedEnc.diagnoses.map((d, i) => (
                        <div key={i} className="d-flex align-items-center gap-2">
                          <span className="badge bg-secondary">{d.icd10_code}</span>
                          <strong>{d.diagnosis_name}</strong>
                          <span className="badge bg-light text-dark border">{d.diagnosis_type}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted small">Clinical evaluation documented in progress notes.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold text-primary"><i className="bi bi-prescription2"></i> Plan (P) - Treatment & Orders</h6>
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-0">{selectedEnc.assessment_plan || 'Symptomatic supportive treatment and outpatient follow-up.'}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top py-2">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedEnc(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
