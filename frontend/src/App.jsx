import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import PatientsView from './views/PatientsView';
import EncountersView from './views/EncountersView';
import CPOEView from './views/CPOEView';
import MedicationsView from './views/MedicationsView';
import DiagnosticsView from './views/DiagnosticsView';
import CDSView from './views/CDSView';
import PortalView from './views/PortalView';
import InteropView from './views/InteropView';
import api from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('doctor');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('dashboard/stats/');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Header */}
      <Navbar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
      />

      {/* Main Workspace */}
      <div className="d-flex flex-grow-1">
        {/* Left Clinical Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          stats={stats} 
        />

        {/* Content Area */}
        <main className="flex-grow-1 overflow-x-hidden bg-light" style={{ minHeight: 'calc(100vh - 65px)' }}>
          {currentTab === 'dashboard' && (
            <DashboardView 
              stats={stats} 
              onNavigate={setCurrentTab} 
              refreshStats={fetchStats} 
            />
          )}
          {currentTab === 'patients' && <PatientsView />}
          {currentTab === 'encounters' && <EncountersView />}
          {currentTab === 'cpoe' && <CPOEView />}
          {currentTab === 'medications' && <MedicationsView />}
          {currentTab === 'diagnostics' && <DiagnosticsView />}
          {currentTab === 'cds' && <CDSView />}
          {currentTab === 'portal' && <PortalView />}
          {currentTab === 'interop' && <InteropView />}
        </main>
      </div>
    </div>
  );
}
