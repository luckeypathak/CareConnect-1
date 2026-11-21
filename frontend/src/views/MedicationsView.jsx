import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function MedicationsView() {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [prescriptions, setPrescriptions] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rxRes, catRes, adminRes] = await Promise.all([
        api.get('prescriptions/'),
        api.get('medications/'),
        api.get('administrations/')
      ]);
      setPrescriptions(rxRes.data.results || rxRes.data);
      setCatalog(catRes.data.results || catRes.data);
      setAdministrations(adminRes.data.results || adminRes.data);
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
          <span className="badge bg-success-subtle text-success mb-1">Module 4</span>
          <h3 className="fw-bold m-0 text-dark">Medication Management & E-Prescribing</h3>
          <p className="text-muted small m-0">Electronic prescriptions, drug formulary catalog, and nursing administration logs</p>
        </div>

        {/* Tab Controls */}
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${activeTab === 'prescriptions' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <i className="bi bi-prescription2"></i> Prescriptions ({prescriptions.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('catalog')}
          >
            <i className="bi bi-journal-medical"></i> Drug Catalog ({catalog.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'admins' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('admins')}
          >
            <i className="bi bi-check2-circle"></i> MAR Logs ({administrations.length})
          </button>
        </div>
      </div>

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Prescription #</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Prescribed Drugs & Dosage</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">Loading prescriptions...</td></tr>
                ) : prescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td className="fw-bold text-primary">{rx.prescription_number}</td>
                    <td><div className="fw-semibold">{rx.patient_name}</div></td>
                    <td>{rx.doctor_name}</td>
                    <td>
                      {rx.items?.map((it, i) => (
                        <div key={i} className="small mb-1">
                          <strong>{it.medication_name}</strong> ({it.strength}) • {it.dosage} • {it.frequency} x {it.duration_days} days
                        </div>
                      ))}
                    </td>
                    <td className="small text-muted">{rx.prescription_date?.slice(0, 10)}</td>
                    <td>
                      <span className={`badge ${rx.status === 'ACTIVE' ? 'badge-normal' : 'bg-light text-secondary border'}`}>
                        {rx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Brand Name</th>
                  <th>Generic Composition</th>
                  <th>Form & Strength</th>
                  <th>Route</th>
                  <th>Manufacturer</th>
                  <th>Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((med) => (
                  <tr key={med.id}>
                    <td className="fw-bold text-secondary">{med.drug_code}</td>
                    <td className="fw-bold text-dark">{med.brand_name}</td>
                    <td>{med.generic_name}</td>
                    <td>{med.dosage_form} ({med.strength})</td>
                    <td><span className="badge bg-light text-dark border">{med.route}</span></td>
                    <td className="small">{med.manufacturer}</td>
                    <td className="fw-semibold text-success">₹ {med.unit_price_inr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MAR Admin Logs */}
      {activeTab === 'admins' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Dose Given</th>
                  <th>Administered By</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Nursing Remarks</th>
                </tr>
              </thead>
              <tbody>
                {administrations.map((adm) => (
                  <tr key={adm.id}>
                    <td>#{adm.id}</td>
                    <td className="fw-semibold">{adm.patient}</td>
                    <td><strong>{adm.dose_given}</strong></td>
                    <td>{adm.administered_by_name}</td>
                    <td className="small text-muted">{adm.administered_time?.slice(0, 16).replace('T', ' ')}</td>
                    <td>
                      <span className={`badge ${adm.status === 'GIVEN' ? 'badge-normal' : 'badge-high'}`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="small text-muted">{adm.remarks}</td>
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
