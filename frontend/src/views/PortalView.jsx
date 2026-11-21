import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function PortalView() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [newAppt, setNewAppt] = useState({
    appointment_number: `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    patient: 1,
    doctor: 2,
    appointment_date: '2026-11-25',
    time_slot: '10:30 AM - 11:00 AM',
    reason_for_visit: 'Quarterly review for hypertension and health checkup',
    status: 'CONFIRMED',
    booking_type: 'PORTAL'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, msgRes, docRes] = await Promise.all([
        api.get('appointments/'),
        api.get('portal-messages/'),
        api.get('health-documents/')
      ]);
      setAppointments(appRes.data.results || appRes.data);
      setMessages(msgRes.data.results || msgRes.data);
      setDocuments(docRes.data.results || docRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('appointments/', newAppt);
      setShowBookModal(false);
      fetchData();
      alert(`Appointment ${newAppt.appointment_number} booked successfully!`);
    } catch (err) {
      alert('Error booking appointment: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-primary-subtle text-primary mb-1">Module 7</span>
          <h3 className="fw-bold m-0 text-dark">Patient Engagement & Portal Services</h3>
          <p className="text-muted small m-0">Self-service scheduling, secure doctor messaging & digital health locker</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Tab Switcher */}
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('appointments')}
            >
              <i className="bi bi-calendar-event"></i> Appointments ({appointments.length})
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('messages')}
            >
              <i className="bi bi-chat-dots-fill"></i> Secure Messages ({messages.length})
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'docs' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('docs')}
            >
              <i className="bi bi-folder2-open"></i> Health Records ({documents.length})
            </button>
          </div>

          <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => setShowBookModal(true)}>
            <i className="bi bi-plus-circle-fill"></i> Book Appointment
          </button>
        </div>
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Appointment #</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason For Visit</th>
                  <th>Channel</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">Loading appointments...</td></tr>
                ) : appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="fw-bold text-primary">{apt.appointment_number}</td>
                    <td><div className="fw-semibold">{apt.patient_name}</div></td>
                    <td>{apt.doctor_name}</td>
                    <td>
                      <div><strong>{apt.appointment_date}</strong></div>
                      <small className="text-muted">{apt.time_slot}</small>
                    </td>
                    <td className="small" style={{ maxWidth: 220 }}>
                      <div className="text-truncate">{apt.reason_for_visit}</div>
                    </td>
                    <td><span className="badge bg-light text-dark border">{apt.booking_type}</span></td>
                    <td>
                      <span className={`badge ${
                        apt.status === 'CONFIRMED' ? 'badge-normal' :
                        apt.status === 'SCHEDULED' ? 'badge-info-custom' : 'bg-light text-secondary border'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Secure Messages Tab */}
      {activeTab === 'messages' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Message Preview</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td className="fw-semibold text-primary">{m.sender_name}</td>
                    <td className="fw-semibold">{m.receiver_name}</td>
                    <td className="fw-bold text-dark">{m.subject}</td>
                    <td className="small text-muted" style={{ maxWidth: 300 }}>
                      <div className="text-truncate">{m.message_body}</div>
                    </td>
                    <td className="small text-muted">{m.sent_at?.slice(0, 10)}</td>
                    <td>
                      <span className={`badge ${m.is_read ? 'bg-light text-secondary border' : 'bg-primary'}`}>
                        {m.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Health Records Tab */}
      {activeTab === 'docs' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Patient</th>
                  <th>Category</th>
                  <th>Uploaded Date</th>
                  <th>Document Link</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td className="fw-bold text-dark">{d.title}</td>
                    <td>{d.patient_name}</td>
                    <td><span className="badge bg-light text-dark border">{d.document_type}</span></td>
                    <td className="small text-muted">{d.uploaded_at?.slice(0, 10)}</td>
                    <td>
                      <span className="text-primary small fw-semibold">
                        <i className="bi bi-file-earmark-pdf-fill text-danger me-1"></i> {d.file_path}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <form onSubmit={handleBookSubmit}>
                <div className="modal-header border-bottom py-3">
                  <h5 className="modal-title fw-bold text-dark">Schedule New Patient Appointment</h5>
                  <button type="button" className="btn-close" onClick={() => setShowBookModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Appointment #</label>
                    <input type="text" className="form-control" value={newAppt.appointment_number} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Consultant Doctor *</label>
                    <select className="form-select" value={newAppt.doctor} onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}>
                      <option value="2">Dr. Arun Verma (Cardiology)</option>
                      <option value="3">Dr. Priya Nair (General Medicine)</option>
                      <option value="4">Dr. Vikram Patel (Pediatrics)</option>
                      <option value="5">Dr. Sneha Kulkarni (OBGYN)</option>
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Date *</label>
                      <input type="date" className="form-control" required value={newAppt.appointment_date} onChange={(e) => setNewAppt({ ...newAppt, appointment_date: e.target.value })} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Time Slot *</label>
                      <select className="form-select" value={newAppt.time_slot} onChange={(e) => setNewAppt({ ...newAppt, time_slot: e.target.value })}>
                        <option value="09:30 AM - 10:00 AM">09:30 AM - 10:00 AM</option>
                        <option value="10:30 AM - 11:00 AM">10:30 AM - 11:00 AM</option>
                        <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                        <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                        <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Reason for Visit *</label>
                    <textarea className="form-control" rows="2" required value={newAppt.reason_for_visit} onChange={(e) => setNewAppt({ ...newAppt, reason_for_visit: e.target.value })}></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top py-2">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBookModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold">Confirm Booking</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
