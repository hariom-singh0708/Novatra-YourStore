import React from 'react';
export default function NotFound(){
  return (
    <div className="container py-5 text-center">
      <h1 className="display-5">404</h1>
      <p className="lead">The page you are looking for was not found.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
}
