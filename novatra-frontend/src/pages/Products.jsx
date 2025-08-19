import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProducts } from "../context/ProductContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

const useQuery = () => new URLSearchParams(useLocation().search);

const categories = [
  "Electronics", "Clothing", "Books", "Home", "Sports", "Toys", "Health", "Beauty"
];

export default function Products() {
  const { list, loading, fetchProducts } = useProducts();
  const query = useQuery();
  const search = query.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(search);  // 👈 new state
  const [debouncedSearch, setDebouncedSearch] = useState(search); // 👈 debounced state

  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("10000");
  const [minRating, setMinRating] = useState(0);
  const [selectedSort, setSelectedSort] = useState("createdAt");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler); // clear timer if user keeps typing
    };
  }, [searchQuery]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.keyword = debouncedSearch;
    if (search) params.keyword = search;   // 👈 important change
    if (selectedCategory) params.category = selectedCategory;
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 10000) params.maxPrice = priceRange[1];
    if (minRating > 0) params.minRating = minRating;

    if (selectedSort.startsWith("-")) {
      params.sortBy = selectedSort.slice(1);
      params.order = "desc";
    } else {
      params.sortBy = selectedSort;
      params.order = "asc";
    }

    fetchProducts(params);
  }, [search, debouncedSearch, selectedCategory, priceRange, minRating, selectedSort]);

  const handlePriceInputChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    if (index === 0) {
      setMinPriceInput(val);
      setPriceRange([val === "" ? 0 : Number(val), priceRange[1]]);
    } else {
      setMaxPriceInput(val);
      setPriceRange([priceRange[0], val === "" ? 10000 : Number(val)]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 10000]);
    setMinPriceInput("0");
    setMaxPriceInput("10000");
    setMinRating(0);
    setSelectedSort("createdAt");
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // filter products on typing
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  return (
    <section className="container py-5 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold text-primary mb-0">Products {search ? `– “${search}”` : ""}</h3>
        <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill">Back Home</Link>
      </div>

      <div className="row gx-4 gy-4">
        {/* Sidebar Filters */}
        <aside className="col-lg-3">
          <div className="card shadow-sm p-3 sticky-top" style={{ top: "20px" }}>
            <h5 className="mb-3">Filters</h5>

            {/* 🔍 Search Bar */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Price Range</label>
              <div className="d-flex gap-2">
                <input type="number" min={0} max={priceRange[1]} value={minPriceInput} onChange={e => handlePriceInputChange(e, 0)} className="form-control" />
                <span className="align-self-center">to</span>
                <input type="number" min={priceRange[0]} max={10000} value={maxPriceInput} onChange={e => handlePriceInputChange(e, 1)} className="form-control" />
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Minimum Rating</label>
              <select className="form-select" value={minRating} onChange={e => setMinRating(Number(e.target.value))}>
                <option value={0}>All Ratings</option>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} stars & up</option>)}
              </select>
            </div>

            {/* Sort */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Sort By</label>
              <select className="form-select" value={selectedSort} onChange={e => setSelectedSort(e.target.value)}>
                <option value="createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Rating: High to Low</option>
              </select>
            </div>

            <button className="btn btn-outline-danger btn-sm w-100" onClick={resetFilters}>Reset Filters</button>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="col-lg-9">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : list.length === 0 ? (
            <p className="text-center text-muted py-5">No products found.</p>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {list.map((p, idx) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
