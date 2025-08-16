import React from 'react';
import AnimatedButton from './AnimatedButton.jsx';
import { Link } from 'react-router-dom';

export default function HeroBanner(){
  return (
    <section className="py-5 hero-gradient border-bottom">
      <div className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold mb-3 animate__animated animate__fadeInUp">Discover. Shop. Smile.</h1>
            <p className="lead text-muted mb-4">A smooth, elegant and blazing fast shopping experience. Curated products from verified merchants only.</p>
            <div className="d-flex gap-3">
              <Link to="/products" className="btn btn-primary btn-lg btn-animated"><i className="fa-solid fa-bag-shopping me-2"></i>Shop Now</Link>
              <Link to="#featured" className="btn btn-outline-secondary btn-lg btn-animated">Explore</Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative">
              <img className="img-fluid rounded-4 shadow" src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop" alt="Hero" />
              <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill text-bg-primary p-3 badge-glow">New</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}