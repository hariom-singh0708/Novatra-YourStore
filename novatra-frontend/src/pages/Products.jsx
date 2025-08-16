import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard.jsx';

export default function Products(){
  const dispatch = useDispatch();
  const { list, loading, page, pages } = useSelector(s=>s.products);
  const [keyword, setKeyword] = useState('');

  useEffect(()=>{ dispatch(getProducts({ page:1, limit: 12 })); },[dispatch]);

  const search = (e)=>{ e.preventDefault(); dispatch(getProducts({ keyword, page:1, limit: 12 })); };

  return (
    <div className="container py-4">
      <form className="row g-2 mb-3" onSubmit={search}>
        <div className="col">
          <input className="form-control" placeholder="Search products…" value={keyword} onChange={e=>setKeyword(e.target.value)} />
        </div>
        <div className="col-auto"><button className="btn btn-primary btn-animated"><i className="fa-solid fa-magnifying-glass"></i></button></div>
      </form>
      {loading && <p>Loading…</p>}
      <div className="row g-3">
        {list.map(p=> (
          <div className="col-6 col-md-4 col-lg-3" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center gap-2 mt-4">
        <button className="btn btn-outline-secondary" disabled={page<=1} onClick={()=>dispatch(getProducts({ page: page-1 }))}>Prev</button>
        <span className="badge text-bg-light">{page} / {pages}</span>
        <button className="btn btn-outline-secondary" disabled={page>=pages} onClick={()=>dispatch(getProducts({ page: page+1 }))}>Next</button>
      </div>
    </div>
  );
}
