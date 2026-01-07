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
          <Link className="navbar-brand fw-bold text-white" to="/dashboard">
            <i className="fas fa-chart-line me-2"></i>
            FinanceTracker Pro
          </Link>

          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/dashboard">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/transactions">
                  Transactions
                </Link>
              </li>

              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/category_list">
                  Categories
                </Link>
              </li>

              <li className="nav-item dropdown ms-3">
                <button
                  className="btn btn-light btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user me-1"></i> {username}
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
    </>
  );
};

export default Transactions;
