import React from 'react';

export default function Navbar({ activeRole, setActiveRole, dbStatus }) {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-white border-bottom px-4 py-2 sticky-top" style={{ zIndex: 1020 }}>
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        {/* Brand */}
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
            <i className="bi bi-heart-pulse-fill fs-5"></i>
          </div>
          <div>
            <div className="fw-bold text-dark fs-5 lh-1">CareConnect <span className="text-primary">EHR</span></div>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>P03 • Connecting Patients and Providers</small>
          </div>
        </div>

        {/* Center System Status */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <span className="badge bg-light text-dark border px-3 py-2 d-flex align-items-center gap-2">
            <span className="rounded-circle bg-success" style={{ width: 8, height: 8, display: 'inline-block' }}></span>
            <span>MySQL 8.0: <strong>careconnect_db</strong></span>
          </span>
          <span className="badge bg-light text-dark border px-3 py-2 d-flex align-items-center gap-2">
            <span className="rounded-circle bg-primary" style={{ width: 8, height: 8, display: 'inline-block' }}></span>
            <span>API: <strong>Django REST (port 8000)</strong></span>
          </span>
        </div>

        {/* Role Switcher & Admin Button */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted small fw-semibold d-none d-sm-inline">Active Role:</label>
            <select 
              className="form-select form-select-sm border-primary shadow-none fw-semibold"
              style={{ width: 'auto', backgroundColor: '#f0f9ff' }}
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
            >
              <option value="doctor">🩺 Dr. Arun Verma (Cardiologist)</option>
              <option value="patient">👤 Rohit Mehta (Patient UHID-101)</option>
              <option value="admin">🛡️ Rajesh Sharma (Administrator)</option>
            </select>
          </div>

          <a 
            href="http://localhost:8000/admin" 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1 px-3"
            title="Open Django Admin (User: admin / Pass: Admin@123)"
          >
            <i className="bi bi-shield-lock-fill text-warning"></i>
            <span>Admin Panel</span>
          </a>
        </div>
      </div>
    </header>
  );
}
