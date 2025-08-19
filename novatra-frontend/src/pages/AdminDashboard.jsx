import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/admin/analytics");
        setAnalytics(data);

        const merchantsRes = await api.get("/admin/merchants");
        setMerchants(merchantsRes.data);
      } catch (err) {
        console.error("Error fetching admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Trigger bar animation after analytics loads
  useEffect(() => {
    if (analytics) {
      setTimeout(() => setAnimateBars(true), 300);
    }
  }, [analytics]);

  const toggleApproval = async (id, approve) => {
    try {
      await api.put(`/admin/merchants/${id}/approve`, { approve });
      setMerchants((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isApproved: approve } : m))
      );
    } catch (err) {
      console.error("Error updating merchant approval:", err);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  // Metrics for cards and bars
  const metrics = [
    { title: "Users", value: analytics.totalUsers, color: "bg-primary" },
    { title: "Merchants", value: analytics.totalMerchants, color: "bg-success" },
    { title: "Products", value: analytics.totalProducts, color: "bg-warning" },
    { title: "Orders", value: analytics.totalOrders, color: "bg-danger" },
    { title: "Total Sales", value: analytics.totalSales, color: "bg-info", isCurrency: true },
  ];

  const maxValue = Math.max(...metrics.map((m) => m.value));

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 animate__animated animate__fadeInDown">
        Admin Dashboard
      </h1>

      {/* Analytics Cards */} {analytics && (<div className="row g-4 mb-5"> 
        <div className="col-md-6 col-lg-4" data-aos="fade-up"> <div className="card border-start border-primary shadow h-100"> <div className="card-body text-center"> <h5 className="card-title">Users</h5> <p className="display-6 fw-bold">{analytics.totalUsers}</p> </div> </div> </div> <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100"> <div className="card border-start border-success shadow h-100"> <div className="card-body text-center"> <h5 className="card-title">Merchants</h5> <p className="display-6 fw-bold">{analytics.totalMerchants}</p> </div> </div> </div> <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200"> <div className="card border-start border-warning shadow h-100"> <div className="card-body text-center"> <h5 className="card-title">Products</h5> <p className="display-6 fw-bold">{analytics.totalProducts}</p> </div> </div> </div> <div className="col-md-6 col-lg-6" data-aos="fade-up" data-aos-delay="300"> <div className="card border-start border-danger shadow h-100"> <div className="card-body text-center"> <h5 className="card-title">Orders</h5> <p className="display-6 fw-bold">{analytics.totalOrders}</p> </div> </div> </div> <div className="col-md-6 col-lg-6" data-aos="fade-up" data-aos-delay="400"> <div className="card border-start border-info shadow h-100"> <div className="card-body text-center"> <h5 className="card-title">Total Sales</h5> <p className="display-6 fw-bold text-success"> ₹{analytics.totalSales.toLocaleString()} </p> </div> </div> </div> </div>)}

      {/* Animated Growth Chart */}
      <div className="card shadow mb-5" data-aos="fade-up">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Growth Chart</h5>
        </div>
        <div className="card-body ">
          <Bar
            data={{
              labels: metrics.map((m) => m.title),
              datasets: [
                {
                  label: "Count",
                  data: metrics.map((m) => m.value),
                  backgroundColor: metrics.map((m) => m.color.replace("bg-", "")),
                },
              ],
            }}
            options={{
              responsive: true,
              animation: {
                duration: 1500,
                easing: "easeOutBounce",
              },
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>



      {/* Merchant Table */}
      <div className="card shadow mb-5" data-aos="fade-up">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Merchants</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Store</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.storeName}</td>
                  <td>{m.email}</td>
                  <td>
                    {m.isApproved ? (
                      <span className="badge bg-success">Approved</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </td>
                  <td>
                    {m.isApproved ? (
                      <button
                        onClick={() => toggleApproval(m._id, false)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleApproval(m._id, true)}
                        className="btn btn-sm btn-outline-success"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card shadow" data-aos="fade-up">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Recent Orders</h5>
        </div>
        <div className="card-body">
          {analytics.recentOrders.length === 0 ? (
            <p className="text-muted">No recent orders</p>
          ) : (
            <ul className="list-group">
              {analytics.recentOrders.map((order) => (
                <li key={order._id} className="list-group-item d-flex justify-content-between">
                  <span>
                    <strong>{order.user?.name}</strong> placed an order
                  </span>
                  <span className="fw-bold text-primary">₹{order.totalPrice}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
