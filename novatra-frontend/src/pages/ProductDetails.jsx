import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetails(){
  const { id } = useParams();
  // TODO: fetch /products/:id and render
  return (
    <div className="container py-4">
      <div className="alert alert-info">Product details for <b>{id}</b> coming next.</div>
    </div>
  );
}
