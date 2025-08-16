import React from 'react';
export default function AnimatedButton({ className='', children, ...rest }){
  return (
    <button className={`btn btn-primary btn-animated ${className}`} {...rest}>
      {children}
    </button>
  );
}
