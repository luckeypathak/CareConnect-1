import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function DiagnosticsView() {
  const [activeTab, setActiveTab] = useState('labs');
  const [labResults, setLabResults] = useState([]);
  const [imagingStudies, setImagingStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [labsRes, imgRes] = await Promise.all([
        api.get('lab-results/'),
        api.get('imaging-studies/')
      ]);
      setLabResults(labsRes.data.results || labsRes.data);
      setImagingStudies(imgRes.data.results || imgRes.data);
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
          <span className="badge bg-purple-subtle text-primary mb-1">Module 5</span>
          <h3 className="fw-bold m-0 text-dark">Laboratory & Diagnostic Imaging</h3>
          <p className="text-muted small m-0">Pathology analyzer results, reference ranges & PACS imaging impressions</p>
        </div>

        {/* Tab Switcher */}
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${activeTab === 'labs' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('labs')}
          >
            <i className="bi bi-droplet-half"></i> Lab Results ({labResults.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'imaging' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('imaging')}
          >
            <i className="bi bi-camera-fill"></i> Imaging Studies ({imagingStudies.length})
          </button>
        </div>
      </div>

      {/* Lab Results Table */}
      {activeTab === 'labs' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Test Code</th>
                  <th>Investigation Name</th>
                  <th>Measured Value</th>
                  <th>Reference Range</th>
                  <th>Flag</th>
                  <th>Reported Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">Loading lab test results...</td></tr>
                ) : labResults.map((res) => (
                  <tr key={res.id}>
                    <td className="fw-bold text-secondary">{res.test_code}</td>
                    <td className="fw-semibold text-dark">{res.test_name}</td>
                    <td>
                      <span className="fw-bold fs-6">{res.measured_value}</span> {res.unit}
                    </td>
                    <td className="small text-muted">
                      {res.normal_min} - {res.normal_max} {res.unit}
                    </td>
                    <td>
                      <span className={`badge ${
                        res.flag === 'CRITICAL' ? 'badge-critical' :
                        res.flag === 'HIGH' ? 'badge-high' :
                        res.flag === 'LOW' ? 'badge-medium' : 'badge-normal'
                      }`}>
                        {res.flag}
                      </span>
                    </td>
                    <td className="small text-muted">{res.reported_at?.slice(0, 10)}</td>
                    <td className="small text-muted">{res.technician_notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Imaging Studies Table */}
      {activeTab === 'imaging' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Accession #</th>
                  <th>Patient</th>
                  <th>Modality</th>
                  <th>Anatomical Site</th>
                  <th>Study Date</th>
                  <th>Status</th>
                  <th>Radiologist Impression</th>
                </tr>
              </thead>
              <tbody>
                {imagingStudies.map((img) => (
                  <tr key={img.id}>
                    <td className="fw-bold text-primary">{img.accession_number}</td>
                    <td className="fw-semibold">{img.patient_name}</td>
                    <td><span className="badge bg-light text-dark border">{img.modality}</span></td>
                    <td>{img.body_site}</td>
                    <td className="small text-muted">{img.study_date?.slice(0, 10)}</td>
                    <td><span className="badge bg-success-subtle text-success">{img.status}</span></td>
                    <td className="small" style={{ maxWidth: 260 }}>
                      <div className="text-truncate">{img.report?.impression || 'Report verified and signed.'}</div>
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
