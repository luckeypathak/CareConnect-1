import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function PatientsView() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    uhid: `UHID-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    first_name: '',
    last_name: '',
    date_of_birth: '1995-01-01',
    gender: 'MALE',
    blood_group: 'B+',
    phone: '',
    email: '',
    address_line1: '',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    postal_code: '201009',
    aadhaar_number: ''
  });

  const fetchPatients = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get(`patients/?search=${query}`);
      setPatients(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(search);
  }, [search]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('patients/', newPatient);
      setShowRegisterModal(false);
      fetchPatients();
      alert(`Patient ${newPatient.first_name} ${newPatient.last_name} registered successfully with ${newPatient.uhid}!`);
    } catch (err) {
      alert('Error registering patient: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-primary-subtle text-primary mb-1">Module 1</span>
          <h3 className="fw-bold m-0 text-dark">Patient Registration & Demographics</h3>
          <p className="text-muted small m-0">Manage Master Patient Index (MPI), contact details & medical history</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowRegisterModal(true)}>
          <i className="bi bi-person-plus-fill"></i> Register New Patient
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Search by UHID, Patient Name, Phone Number, or City..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th>UHID</th>
                <th>Patient Name</th>
                <th>Gender / DOB</th>
                <th>Blood Group</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">Loading patients...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No patient records found matching query.</td></tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold text-primary">{p.uhid}</td>
                    <td>
                      <div className="fw-bold">{p.first_name} {p.last_name}</div>
                      <small className="text-muted">{p.email || 'No email registered'}</small>
                    </td>
                    <td>
                      <div>{p.gender}</div>
                      <small className="text-muted">{p.date_of_birth}</small>
                    </td>
                    <td>
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold">
                        {p.blood_group || 'N/A'}
                      </span>
                    </td>
                    <td>{p.phone}</td>
                    <td>{p.city}, {p.state}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedPatient(p)}
                      >
                        <i className="bi bi-eye"></i> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom py-3">
                <div>
                  <h5 className="modal-title fw-bold text-dark">{selectedPatient.first_name} {selectedPatient.last_name}</h5>
                  <span className="badge bg-primary">{selectedPatient.uhid}</span>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelectedPatient(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary border-bottom pb-1">Demographics</h6>
                    <p className="mb-1"><strong>DOB:</strong> {selectedPatient.date_of_birth}</p>
                    <p className="mb-1"><strong>Gender:</strong> {selectedPatient.gender}</p>
                    <p className="mb-1"><strong>Blood Group:</strong> {selectedPatient.blood_group || 'Not recorded'}</p>
                    <p className="mb-1"><strong>Marital Status:</strong> {selectedPatient.marital_status || 'N/A'}</p>
                    <p className="mb-1"><strong>Aadhaar Number:</strong> {selectedPatient.aadhaar_number || 'Not provided'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary border-bottom pb-1">Contact Details</h6>
                    <p className="mb-1"><strong>Phone:</strong> {selectedPatient.phone}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedPatient.email || 'None'}</p>
                    <p className="mb-1"><strong>Address:</strong> {selectedPatient.address_line1}</p>
                    {selectedPatient.address_line2 && <p className="mb-1"><strong>Landmark:</strong> {selectedPatient.address_line2}</p>}
                    <p className="mb-1"><strong>City/State:</strong> {selectedPatient.city}, {selectedPatient.state} - {selectedPatient.postal_code}</p>
                  </div>

                  {/* Allergies Sub-list */}
                  <div className="col-12 mt-3">
                    <h6 className="fw-bold text-danger border-bottom pb-1"><i className="bi bi-shield-slash"></i> Recorded Allergies</h6>
                    {selectedPatient.allergies?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((a, i) => (
                          <span key={i} className="badge bg-danger-subtle text-danger border border-danger-subtle p-2">
                            <strong>{a.allergen_name}</strong> ({a.severity}) - {a.reaction}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small">No known drug/food allergies recorded for this patient.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top py-2">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Patient Modal */}
      {showRegisterModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <form onSubmit={handleRegisterSubmit}>
                <div className="modal-header border-bottom py-3">
                  <h5 className="modal-title fw-bold text-dark">Register New Patient Record</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRegisterModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">UHID (Generated)</label>
                      <input type="text" className="form-control" value={newPatient.uhid} readOnly />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input type="text" className="form-control" required value={newPatient.first_name} onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Last Name *</label>
                      <input type="text" className="form-control" required value={newPatient.last_name} onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Date of Birth *</label>
                      <input type="date" className="form-control" required value={newPatient.date_of_birth} onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Gender *</label>
                      <select className="form-select" value={newPatient.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Blood Group</label>
                      <select className="form-select" value={newPatient.blood_group} onChange={(e) => setNewPatient({ ...newPatient, blood_group: e.target.value })}>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number *</label>
                      <input type="text" className="form-control" placeholder="+91-98XXXXXXXX" required value={newPatient.phone} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email</label>
                      <input type="email" className="form-control" placeholder="name@domain.com" value={newPatient.email} onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Residential Address *</label>
                      <input type="text" className="form-control" placeholder="Flat, Street, Area" required value={newPatient.address_line1} onChange={(e) => setNewPatient({ ...newPatient, address_line1: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">City *</label>
                      <input type="text" className="form-control" required value={newPatient.city} onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">State *</label>
                      <input type="text" className="form-control" required value={newPatient.state} onChange={(e) => setNewPatient({ ...newPatient, state: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Postal Code *</label>
                      <input type="text" className="form-control" required value={newPatient.postal_code} onChange={(e) => setNewPatient({ ...newPatient, postal_code: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-2">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRegisterModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold">Save to MySQL Database</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
