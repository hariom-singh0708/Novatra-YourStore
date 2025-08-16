import React from 'react';
export default function MerchantDashboard(){
  return (
    <div className="container py-4">
      <h3 className="mb-3">Merchant Dashboard</h3>
      <div className="alert alert-warning">Only approved merchants can access product creation & analytics here.</div>
    </div>
  );
}