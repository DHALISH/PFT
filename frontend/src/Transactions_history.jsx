import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Dashboard.css";

const Transactions_history = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fetch current user's transactions
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      navigate("/");
      return;
    }

    setUsername(storedUsername);

    fetch("http://127.0.0.1:8000/api/transactions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or failed request");
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [navigate]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Filter logic
  const filteredTransactions = transactions.filter((t) => {
    const matchType = filterType === "all" || t.type === filterType;
    const matchStart = !startDate || new Date(t.date) >= new Date(startDate);
    const matchEnd = !endDate || new Date(t.date) <= new Date(endDate);
    return matchType && matchStart && matchEnd;
  });

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark black-navbar">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold text-white" to="/dashboard">
            <i className="fas fa-chart-line me-2"></i>
            FinanceTracker Pro
          </Link>

          <div className="collapse navbar-collapse">
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
        <h2 className="fw-bold mb-4">Transaction History</h2>

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          t.type === "income"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td>{t.category_name}</td>
                    <td className="text-end fw-bold">
                      {t.type === "income" ? "+" : "-"}₹{t.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Transactions_history;
