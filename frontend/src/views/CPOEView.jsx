import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CPOEView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('cpoe-orders/');
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = typeFilter === 'ALL' 
    ? orders 
    : orders.filter((o) => o.order_type === typeFilter);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-warning-subtle text-warning-emphasis mb-1">Module 3</span>
          <h3 className="fw-bold m-0 text-dark">Computerized Provider Order Entry (CPOE)</h3>
          <p className="text-muted small m-0">Direct entry of diagnostic, lab, imaging, and medication requisitions</p>
        </div>
        {/* Type Filter */}
        <div className="d-flex gap-2">
          {['ALL', 'LAB', 'IMAGING', 'MEDICATION', 'PROCEDURE'].map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Patient</th>
                <th>Ordering Provider</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Order Items</th>
                <th>Clinical Indication</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">Loading CPOE orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No orders found for selected category.</td></tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="fw-bold text-primary">{ord.order_number}</td>
                    <td><div className="fw-semibold">{ord.patient_name}</div></td>
                    <td>{ord.provider_name}</td>
                    <td>
                      <span className={`badge ${
                        ord.order_type === 'LAB' ? 'bg-info-subtle text-info border' :
                        ord.order_type === 'IMAGING' ? 'bg-purple-subtle text-primary border' :
                        ord.order_type === 'MEDICATION' ? 'bg-success-subtle text-success border' : 'bg-light text-dark border'
                      }`}>
                        {ord.order_type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        ord.priority === 'STAT' ? 'badge-critical' :
                        ord.priority === 'URGENT' ? 'badge-high' : 'badge-normal'
                      }`}>
                        {ord.priority}
                      </span>
                    </td>
                    <td>
                      {ord.items?.length > 0 ? (
                        <div>
                          {ord.items.map((it, idx) => (
                            <span key={idx} className="badge bg-light text-dark border me-1">
                              {it.item_name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted small">Standard protocol item</span>
                      )}
                    </td>
                    <td className="small" style={{ maxWidth: 220 }}>
                      <div className="text-truncate">{ord.clinical_indication}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        ord.order_status === 'COMPLETED' ? 'bg-success-subtle text-success' :
                        ord.order_status === 'IN_PROGRESS' ? 'bg-warning-subtle text-warning' : 'bg-light text-secondary border'
                      }`}>
                        {ord.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
