import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Transaction.css";

const Transactions = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [categories, setCategories] = useState([]);

  // Load user + categories
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      navigate("/");
      return;
    }

    setUsername(storedUsername);
    fetchCategories(token);
  }, [navigate]);

  // Fetch categories from DB
  const fetchCategories = async (token) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Save transaction to DB
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData(e.target);

    const transactionData = {
      description: formData.get("description"),
      amount: formData.get("amount"),
      category: formData.get("category"),
      type: formData.get("type"),
      date: formData.get("date"),
    };

    const res = await fetch("http://127.0.0.1:8000/api/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (res.ok) {
      alert("Transaction saved successfully");
      e.target.reset();
    } else {
      alert("Failed to save transaction");
    }
  };

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

      {/* Spacer */}
      <div style={{ marginTop: "80px" }}></div>

      {/* Content */}
      <div className="container mt-4">
        <h2 className="fw-bold mb-4">Transactions</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm p-3">

              <div className="d-flex align-items-center gap-3 mb-3">
              <h4 className="fw-bold mb-0">
                <i className="fas fa-plus me-2"></i> Add Transaction
              </h4>
              
              <button
                className="btn btn-primary btn-history-sm"
                onClick={() => navigate("/transactions_history")}
              >
                <i className="fas fa-history me-1"></i> History
              </button>
            </div>


              <form onSubmit={handleAddTransaction}>
                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="mb-3">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <div>
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      required
                    />{" "}
                    Income
                    &nbsp;&nbsp;
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      required
                    />{" "}
                    Expense
                  </div>
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" name="date" className="form-control" required />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  <i className="fas fa-save me-2"></i> Save Transaction
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
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

export default Transactions;
