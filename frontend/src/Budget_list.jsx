import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getUsedPercentage = (spent, amount) => {
    if (!amount || amount === 0) return 0;
    return Math.min((spent / amount) * 100, 100);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/budgets/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .catch((err) => console.error(err));
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ background: "linear-gradient(135deg, #f5f8ff, #e8f0ff)" }}
    >
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
                <a className="nav-link text-white" href="/analytics">
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

      {/* MAIN CONTENT */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="fas fa-calculator me-2"></i> Budgets
          </h2>

          <Link to="/budget/" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i> Create Budget
          </Link>
        </div>

        <div className="row">
          {budgets.length > 0 ? (
            budgets.map((budget) => {
              const percentage = getUsedPercentage(budget.spent, budget.amount);

              return (
                <div className="col-md-6 mb-4" key={budget.id}>
                  <div className="card shadow-sm border-0 rounded-4">
                    <div className="card-body">
                      <h5 className="card-title text-primary">
                        {budget.category_name}
                      </h5>

                      <p className="mb-2">
                        <strong>Budget Amount:</strong> ₹{budget.amount}
                        <br />
                        <strong>Spent:</strong> ₹{budget.spent || 0}
                        <br />
                        <strong>Period:</strong>{" "}
                        {budget.start_date} → {budget.end_date}
                      </p>

                      <div className="progress mb-2" style={{ height: "10px" }}>
                        <div
                          className={`progress-bar ${
                            percentage >= 100
                              ? "bg-danger"
                              : percentage >= 75
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <small className="text-muted">
                        <i className="fas fa-chart-line me-1"></i>
                        {percentage.toFixed(1)}% of budget used
                      </small>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card text-center p-5 shadow-sm border-0 rounded-4">
              <i className="fas fa-calculator fa-3x text-muted mb-3"></i>
              <h5>No budgets found</h5>
              <p className="text-muted">
                Create budgets to track your spending limits and goals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
