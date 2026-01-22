import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Budget.css";

const Budget = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // ✅ Added state
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/budget/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          category, // ✅ now properly set
          amount: Number(amount),
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (response.ok) {
        navigate("/budget_list");
      } else {
        const errorData = await response.json();
        console.error("Error saving budget:", errorData);
        alert("Failed to save budget. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Check your server connection.");
    }
  };

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

  // ✅ Call fetchCategories when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCategories(token);
    }
  }, []);

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

      {/* CREATE BUDGET CONTAINER */}
      <style>{`body { margin:90px }`}</style>
      <div className="budget-page">
        <div className="budget-card">
          <div className="budget-header">
            <i className="fas fa-plus-circle me-2"></i>
            Create New Budget
          </div>

          <form className="p-4" onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={category} // ✅ bind to state
                  onChange={(e) => setCategory(e.target.value)} // ✅ update state
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Budget Amount</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/budget_list")}
              >
                ← Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                <i className="fas fa-check-circle me-1"></i>
                Create Budget
              </button>
            </div>
          </form>
        </div>
      </div>
                      
    </>
  );
};

export default Budget;