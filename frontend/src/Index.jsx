import React from "react";
import "./Index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Index = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top black-navbar">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-white" href="#home">
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
            <ul className="navbar-nav ms-auto">
              <li className="nav-item ms-2">
                <a className="nav-link text-white" href="#features">Features</a>
              </li>
              <li className="nav-item ms-2">
                <a className="nav-link text-white" href="#">About</a>
              </li>
              <li className="nav-item ms-2">
                <a className="nav-link text-white" href="#">Contact</a>
              </li>
              <li className="nav-item ms-2">
                <a className="btn btn-outline-light btn-sm" href="/signin">Login</a>
              </li>
              <li className="nav-item ms-2">
                <a className="btn btn-light btn-sm" href="/signup">Sign Up</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container hero-content">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Take Control of Your Financial Future
              </h1>
              <p className="lead mb-4">
                Track expenses, set budgets, and achieve goals effortlessly.
              </p>

              <div className="d-flex gap-3 mb-4">
                <a href="/signup" className="btn btn-gradient btn-lg">
                  <i className="fas fa-rocket me-2"></i>Get Started Free
                </a>
                <a href="/signin" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-play me-2"></i>Sign In
                </a>
              </div>

              <div className="d-flex gap-4">
                <div>
                  <h4>10K+</h4>
                  <small>Active Users</small>
                </div>
                <div>
                  <h4>₹2M+</h4>
                  <small>Money Tracked</small>
                </div>
                <div>
                  <h4>4.9★</h4>
                  <small>User Rating</small>
                </div>
              </div>
            </div>

            {/* Mobile Graphic + Animated Pie */}
            <div className="col-lg-6 text-center mobile-chart-wrapper">
              <i className="fas fa-mobile-alt mobile-icon"></i>
              <div className="pie-chart"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-white">Powerful Features</h2>
            <p className="lead text-light opacity-75">
              Everything you need to manage your money smartly
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <i className="fas fa-exchange-alt"></i>
                <h5>Transaction Tracking</h5>
                <p>Track income & expenses in real time with detailed insights.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <i className="fas fa-calculator"></i>
                <h5>Smart Budgeting</h5>
                <p>Create budgets that adapt automatically to your spending.</p>
              </div>
            </div>

              <div className="col-md-4">
                <div className="feature-card">
                  <i className="fas fa-chart-line"></i>
                  <h5>Analytics</h5>
                  <p>Gain insights into your spending patterns and financial trends.</p>
                </div>
              </div>
          </div>
        </div>
      </section>
      <section id="footer" className="footer-section">
        <div className="container text_center">
          <p className="text-white">© 2026 PFT. All rights reserved.</p>
        </div>
      </section>

    </>
  );
};

export default Index;
