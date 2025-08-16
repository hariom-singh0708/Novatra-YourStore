import React, { useEffect } from 'react';

export default function AdminDashboard(){
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector(s=>s.admin);

  useEffect(()=>{ dispatch(getAnalytics()); },[dispatch]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Admin Dashboard</h3>
      {loading && <div className="alert alert-secondary">Loading analytics…</div>}
      {analytics && (
        <div className="row g-3">
          <div className="col-md-3"><div className="card shadow-sm hover-rise"><div className="card-body"><div className="text-muted">Users</div><div className="fs-4 fw-bold">{analytics.totalUsers}</div></div></div></div>
          <div className="col-md-3"><div className="card shadow-sm hover-rise"><div className="card-body"><div className="text-muted">Merchants</div><div className="fs-4 fw-bold">{analytics.totalMerchants}</div></div></div></div>
          <div className="col-md-3"><div className="card shadow-sm hover-rise"><div className="card-body"><div className="text-muted">Products</div><div className="fs-4 fw-bold">{analytics.totalProducts}</div></div></div></div>
          <div className="col-md-3"><div className="card shadow-sm hover-rise"><div className="card-body"><div className="text-muted">Orders</div><div className="fs-4 fw-bold">{analytics.totalOrders}</div></div></div></div>
        </div>
      )}
    </div>
  );
}