import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab, stats }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', badge: null },
    { id: 'patients', label: '1. Patient Registration', icon: 'bi-people-fill', badge: stats?.total_patients },
    { id: 'encounters', label: '2. Clinical Documentation', icon: 'bi-journal-medical', badge: stats?.total_encounters },
    { id: 'cpoe', label: '3. CPOE Orders', icon: 'bi-card-checklist', badge: null },
    { id: 'medications', label: '4. Medications & Rx', icon: 'bi-capsule', badge: stats?.active_prescriptions },
    { id: 'diagnostics', label: '5. Lab & Imaging', icon: 'bi-radioactive', badge: stats?.pending_lab_orders },
    { id: 'cds', label: '6. CDS Decision Support', icon: 'bi-lightning-charge-fill', badge: stats?.active_cds_alerts, badgeClass: 'bg-danger' },
    { id: 'portal', label: '7. Patient Portal', icon: 'bi-calendar-check-fill', badge: stats?.upcoming_appointments },
    { id: 'interop', label: '8 & 9. FHIR & Audit Logs', icon: 'bi-shield-check', badge: null },
  ];

  return (
    <nav className="sidebar p-2">
      <div className="px-3 pt-3 pb-2 text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
        EHR Clinical Modules
      </div>
      <div className="d-flex flex-column gap-1 flex-grow-1">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <div
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span className="flex-grow-1">{item.label}</span>
              {item.badge !== null && item.badge !== undefined && (
                <span className={`badge rounded-pill ${item.badgeClass || (isActive ? 'bg-primary' : 'bg-secondary')}`} style={{ fontSize: '0.72rem' }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Superuser credentials pill in footer */}
      <div className="p-3 border-top bg-light rounded m-2">
        <div className="d-flex align-items-center gap-2 mb-1">
          <i className="bi bi-person-fill-lock text-primary"></i>
          <span className="small fw-bold">Admin Credentials</span>
        </div>
        <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
          User: <code>admin</code><br />
          Pass: <code>Admin@123</code>
        </div>
      </div>
    </nav>
  );
}
