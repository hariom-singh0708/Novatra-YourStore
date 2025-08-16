import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function Cart(){
  const { items } = useSelector(s=>s.cart);
  const dispatch = useDispatch();
  const total = items.reduce((a,c)=> a + (c.price*c.qty), 0);

  return (
    <div className="container py-4">
      <h3 className="mb-3">Your Cart</h3>
      {!items.length && <div className="alert alert-secondary">Cart is empty.</div>}
      {items.map(it=> (
        <div key={it._id} className="card mb-2">
          <div className="card-body d-flex align-items-center gap-3">
            <img src={it.images?.[0]} width="64" height="64" className="rounded" />
            <div className="flex-grow-1">
              <div className="fw-semibold">{it.name}</div>
              <div className="text-muted small">₹{it.price}</div>
            </div>
            <input type="number" className="form-control" style={{width:90}} value={it.qty} min={1} onChange={e=>dispatch(updateQty({ id: it._id, qty: +e.target.value }))} />
            <button className="btn btn-outline-danger" onClick={()=>dispatch(removeFromCart(it._id))}><i className="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      ))}
      {!!items.length && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="fs-5">Total: <b>₹{total}</b></div>
          <a href="/checkout" className="btn btn-primary btn-animated">Proceed to Checkout</a>
        </div>
      )}
    </div>
  );
}