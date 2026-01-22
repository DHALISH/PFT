import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Budget.css";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getUsedPercentage = (spent, amount) => {
    if (!amount) return 0;
    return Math.min((spent / amount) * 100, 100);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/budgets/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then(setBudgets)
      .catch(console.error);
  }, [token, navigate]);



  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
    // 🔹 Delete Budget
  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/budgets/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      fetchCategories();
    } catch (error) {
      alert("Error deleting budget");
      console.error(error);
    }
  };

  return (
    <div className="budgets-page">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark black-navbar">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold" href="/dashboard">
            <i className="fas fa-chart-line me-2"></i> FinanceTracker Pro
          </a>

          <ul className="navbar-nav ms-auto align-items-center">
            {["dashboard", "transactions", "category_list", "budget_list", "analytics"].map(
              (path, i) => (
                <li className="nav-item ms-3" key={i}>
                  <a className={`nav-link ${path === "budget_list" ? "active" : ""}`} href={`/${path}`}>
                    {path.replace("_list", "").charAt(0).toUpperCase() + path.slice(1)}
                  </a>
                </li>
              )
            )}

            <li className="nav-item dropdown ms-3">
              <button className="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                <i className="fas fa-user me-1"></i> {username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="budgets-content">
        <div className="budget-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2><i className="fas fa-calculator me-2"></i> Budgets</h2>
            <Link to="/budget/" className="btn btn-primary btn-lg">
              <i className="fas fa-plus me-2"></i> Create Budget
            </Link>
          </div>

          <div className="row">
            {budgets.length ? (
              budgets.map((b) => {
                const percent = getUsedPercentage(b.spent, b.amount);
                return (
                  <div className="col-md-6 mb-4" key={b.id}>
                    <div className="budget-card">
                      <button
                        className="btn btn-outline-danger btn-sm delete-btn"
                        onClick={() => handleDeleteBudget(b.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>

                      <h5>{b.category_name}</h5>
                      <p>
                        <strong>Amount:</strong> ₹{b.amount}<br />
                        <strong>Spent:</strong> ₹{b.spent || 0}<br />
                        <strong>Period:</strong> {b.start_date} → {b.end_date}
                      </p>

                      <div className="progress">
                        <div
                          className={`progress-bar ${
                            percent >= 100 ? "bg-danger" :
                            percent >= 75 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <small>{percent.toFixed(1)}% used</small>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-budget-card">
                <i className="fas fa-calculator fa-3x mb-3"></i>
                <h5>No budgets found</h5>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <h4>Finance Tracker</h4>
            <p>Manage income & expenses smarter.</p>
          </div>
          <div>
            <h5>Quick Links</h5>
            <a href="/dashboard">Dashboard</a>
            <a href="/budget_list">Budgets</a>
            <a href="/analytics">Analytics</a>
          </div>
          <div>
            <h5>Contact</h5>
            <p>Email: support@financetracker.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div>
            <h5>Follow Us</h5>
            <div className="social-icons">
              <i className="fab fa-instagram"></i>
              <i className="fab fa-x-twitter"></i>
              <i className="fab fa-facebook"></i>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Finance Tracker</div>
      </footer>
    </div>
  );
};

export default Budgets;
