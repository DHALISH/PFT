import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [dashboardData, setDashboardData] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
    budgets: [],
    transactions: [],
    category_name: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!userId || !token) {
      navigate("/");
      return;
    }

    setUsername(storedUsername);

    fetch(`http://127.0.0.1:8000/api/dashboard/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((data) => {
        setDashboardData({
          total_income: data.total_income,
          total_expense: data.total_expense,
          balance: data.balance,
          category_name: data.category_name || "",
          budgets: data.budgets || [],
          transactions: data.transactions || [],
        });
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark black-navbar">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-white" href="#">
            <i className="fas fa-chart-line me-2"></i>
            FinanceTracker Pro
          </a>

          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/dashboard">Dashboard</a>
              </li>
              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/transactions">Transactions</a>
              </li>
              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/category_list">Categories</a>
              </li>
              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/budget_list">Budget</a>
              </li>
              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/analytics">Analytics</a>
              </li>

              <li className="nav-item dropdown ms-3">
                <button className="btn btn-light btn-sm fw-semibold dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fas fa-user me-1"></i>
                  {username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: "40px" }}></div>

      <section className="dashboard-section">
        <div className="container">

          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="fw-bold">Welcome to Your Dashboard</h2>
            <p className="lead">
              Monitor your finances, manage budgets, and achieve your goals.
            </p>
          </div>

          {/* Top Cards (aligned already by Bootstrap grid) */}
          <div className="row g-4 mb-5 justify-content-center">
            <div className="col-lg-3 col-md-6">
              <div className="feature-card text-center h-100">
                <i className="fas fa-exchange-alt"></i>
                <h5>Total Income</h5>
                <p>₹ {dashboardData.total_income}</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-card text-center h-100">
                <i className="fas fa-calculator"></i>
                <h5>Total Expenses</h5>
                <p>₹ {dashboardData.total_expense}</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-card text-center h-100">
                <i className="fas fa-wallet"></i>
                <h5>Balance</h5>
                <p>₹ {dashboardData.balance}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions (unchanged) */}
          <div className="quick-actions mb-5">
            <h6>
              <i className="fas fa-bolt me-2"></i>Quick Actions
            </h6>

            <div className="action-buttons">
              <button className="btn action-white" onClick={() => navigate("/transactions")}>
                <i className="fas fa-plus me-2"></i>Add Transaction
              </button>

              <button className="btn action" onClick={() => navigate("/category_list")}>
                <i className="fas fa-tags me-2"></i>Add Category
              </button>

              <button className="btn action" onClick={() => navigate("/budget_list")}>
                <i className="fas fa-wallet me-2"></i>Create Budget
              </button>

              <button className="btn action" onClick={() => navigate("/analytics")}>
                <i className="fas fa-chart-line me-2"></i>View Analytics
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="row g-4 mb-6">
            {/* Recent Transactions */}
            <div className="col-lg-6">
              <div className="info-card">
                <h6>
                  <i className="fas fa-history me-2"></i>Recent Transactions
                </h6>

                <div className="scroll-box">
                {dashboardData.transactions.length ? (
                  dashboardData.transactions.slice(0, 5).map((t) => (
                    <div
                      key={t.id}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      {/* LEFT SIDE: Category + Type */}
                      <div>
                        <strong>{t.category_name}</strong>
                        <div className="small text-muted text-capitalize">
                          {t.type} - {t.date}
                        </div>
                      </div>
                  
                      {/* RIGHT SIDE: Amount */}
                      <span
                        className={`fw-bold ${
                          t.type === "income" ? "text-success" : "text-danger"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}₹{t.amount}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No transactions yet.</p>
                )}
              </div>

              </div>
            </div>

            {/* Recent Budgets */}
            <div className="col-lg-6">
              <div className="info-card">
                <h6>
                  <i className="fas fa-wallet me-2"></i>Recent Budgets
                </h6>

                <div className="scroll-box">
                  {dashboardData.budgets.length ? (
                    dashboardData.budgets.slice(0, 5).map((b) => (
                      <div key={b.id} className="mb-2">
                        <strong>{b.category_name}</strong>
                        <div className="text-muted">₹ {b.amount}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No budgets created yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      <footer className="footer">
        <div className="footer-container">
                      
          <div className="footer-brand">
            <h4>Finance Tracker</h4>
            <p>Manage your income & expenses smarter.</p>
          </div>
                      
          <div className="footer-links">
            <h5>Quick Links</h5>
            <a href="#">Dashboard</a>
            <a href="#">Budgets</a>
            <a href="#">Analytics</a>
          </div>
                      
          <div className="footer-contact">
            <h5>Contact</h5>
            <p>Email: support@financetracker.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
                      
          <div className="footer-social">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-x-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
            </div>
          </div>
                      
        </div>
                      
        <div className="footer-bottom">
          © 2026 Finance Tracker. All rights reserved.
        </div>
      </footer>
                      
    </>
  );
};

export default Dashboard;
