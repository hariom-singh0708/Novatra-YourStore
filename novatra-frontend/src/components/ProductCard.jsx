import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }){
  return (
    <div className="card h-100 shadow-sm hover-rise card-zoom animate__animated animate__fadeIn">
      <div className="ratio ratio-1x1 overflow-hidden">
        <img src={product?.images?.[0] || 'https://via.placeholder.com/600x600?text=Novatra'} className="card-img-top object-fit-cover" alt={product.name} />
      </div>
      <div className="card-body d-flex flex-column">
        <h6 className="card-title text-truncate" title={product.name}>{product.name}</h6>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="fw-bold">₹{product.price}</span>
          {product.stock > 0 ? <span className="badge text-bg-success badge-glow">In stock</span> : <span className="badge text-bg-secondary">Out</span>}
        </div>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/product/${product._id}`} className="btn btn-outline-primary w-100 btn-animated">View</Link>
          <button className="btn btn-primary w-100 btn-animated"><i className="fa-solid fa-cart-plus me-2"></i>Add</button>
        </div>
      </div>
    </div>
  );
}
