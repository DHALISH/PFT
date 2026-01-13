import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Category_list = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Auth + Fetch categories
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setUsername(localStorage.getItem("username"));
    fetchCategories();
  }, [navigate, token]);

  // 🔹 Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🔹 Add Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Failed to add category");

      setName("");
      setDescription("");
      fetchCategories();
    } catch (error) {
      alert("Error adding category");
      console.error(error);
    }
    
  };

  // 🔹 Delete Category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/categories/${id}/`,
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
      alert("Error deleting category");
      console.error(error);
    }
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


      <div style={{ marginTop: "50px" }} />

      {/* Category Section */}
      <div className="container">
        <h3 className="mb-4 fw-bold">Category Management</h3>

        {/* Add Category */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-2">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="col-md-2">
                  <button className="btn btn-success w-100">
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Category Cards */}
        <div className="row">
          {categories.length === 0 && (
            <p className="text-muted">No categories found</p>
          )}

          {categories.map((cat) => (
            <div className="col-md-4 mb-4" key={cat.id}>
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="fw-bold">{cat.name}</h5>
                  <p className="text-muted">
                    {cat.description || "No description"}
                  </p>
                </div>

                <div className="card-footer bg-transparent text-end">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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

export default Category_list;
