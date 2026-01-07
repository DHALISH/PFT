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
    goal: 0,
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!userId || !token) {
      navigate("/"); // redirect to login/index
      return;
    }

    setUsername(storedUsername);

    fetch(`http://127.0.0.1:8000/api/dashboard/${userId}/`, {
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
      .then((data) => setDashboardData(data))
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

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/dashboard">
                  Dashboard
                </a>
              </li>

              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/transactions">
                  Transactions
                </a>
              </li>

              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/category_list">
                  Categories
                </a>
              </li>

              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="/budget_list">
                  Budget
                </a>
              </li>
              <li className="nav-item ms-3">
                <a className="nav-link text-white" href="#">
                  Analytics
                </a>
              </li>

              {/* Profile Dropdown */}
              <li className="nav-item dropdown ms-3">
                <button
                  className="btn btn-light btn-sm fw-semibold dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user me-1"></i>
                  {username}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div style={{ marginTop: "80px" }}></div>

      {/* Dashboard Section */}
      <section className="dashboard-section">
        <div className="container">
          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="fw-bold">Welcome to Your Dashboard</h2>
            <p className="lead">
              Monitor your finances, manage budgets, and achieve your goals.
            </p>
          </div>

          {/* Top Cards */}
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6">
              <div className="feature-card">
                <i className="fas fa-exchange-alt"></i>
                <h5>Total Income</h5>
                <p>₹ {dashboardData.total_income}</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-card">
                <i className="fas fa-calculator"></i>
                <h5>Total Expenses</h5>
                <p>₹ {dashboardData.total_expense}</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-card">
                <i className="fas fa-wallet"></i>
                <h5>Balance</h5>
                <p>₹ {dashboardData.balance}</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-card">
                <i className="fas fa-bullseye"></i>
                <h5>Goal</h5>
                <p>₹ {dashboardData.goal}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions mb-5">
            <h6>
              <i className="fas fa-bolt me-2"></i>Quick Actions
            </h6>

            <div className="action-buttons">
              <button className="btn action-white">
                <i className="fas fa-plus me-2"></i>Add Transaction
              </button>

              <button
                className="btn action"
                onClick={() => navigate("/category_list")}
              >
                <i className="fas fa-tags me-2"></i>
                Add Category
              </button>

              <button className="btn action">
                <i className="fas fa-wallet me-2"></i>Create Budget
              </button>

              <button className="btn action">
                <i className="fas fa-bullseye me-2"></i>Set Goal
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className="info-card">
                <h6>
                  <i className="fas fa-history me-2"></i>Recent Transactions
                </h6>
                <p>No transactions yet.</p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="info-card">
                <h6>
                  <i className="fas fa-bullseye me-2"></i>Financial Goals
                </h6>
                <p>
                  No goals set. <span className="link-text">Create one</span>
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="info-card">
                <h6>
                  <i className="fas fa-wallet me-2"></i>Recent Budgets
                </h6>
                <p>No budgets created yet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
