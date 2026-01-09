import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "./Analytics.css";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Analytics = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";

  // ===============================
  // STATES
  // ===============================
  const [incomeData, setIncomeData] = useState(Array(12).fill(0));
  const [expenseData, setExpenseData] = useState(Array(12).fill(0));
  const [topExpenses, setTopExpenses] = useState([]);
  const [months, setMonths] = useState(12);

  const currentYear = new Date().getFullYear();

  // ===============================
  // FETCH ANALYTICS
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/analytics/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIncomeData(
          (data.income || []).map(Number).concat(Array(12).fill(0)).slice(0, 12)
        );
        setExpenseData(
          (data.expenses || []).map(Number).concat(Array(12).fill(0)).slice(0, 12)
        );
        setTopExpenses(data.top_expenses || []);
      })
      .catch(console.error);
  }, []);

  // ===============================
  // VISIBLE DATA
  // ===============================
  const visibleLabels = useMemo(
    () => MONTH_LABELS.slice(0, months),
    [months]
  );

  const visibleIncome = useMemo(
    () => incomeData.slice(0, months),
    [incomeData, months]
  );

  const visibleExpense = useMemo(
    () => expenseData.slice(0, months),
    [expenseData, months]
  );

  const visibleBalance = useMemo(
    () => visibleIncome.map((v, i) => v - (visibleExpense[i] || 0)),
    [visibleIncome, visibleExpense]
  );

  // ===============================
  // TOTALS
  // ===============================
  const totalIncome = visibleIncome.reduce((a, b) => a + b, 0);
  const totalExpenses = visibleExpense.reduce((a, b) => a + b, 0);
  const netBalance = totalIncome - totalExpenses;

  // ===============================
  // CHART
  // ===============================
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: visibleLabels,
        datasets: [
          {
            label: "Income",
            data: visibleIncome,
            borderColor: "#36cfc9",
            backgroundColor: "rgba(54, 207, 201, 0.3)",
            borderWidth: 3,
            fill: true,
            tension: 0.45,
          },
          {
            label: "Expenses",
            data: visibleExpense,
            borderColor: "#ff4d4f",
            backgroundColor: "rgba(255, 77, 79, 0.3)",
            borderWidth: 3,
            fill: true,
            tension: 0.45,
          },
          {
            label: "Balance",
            data: visibleBalance,
            borderColor: "#fadb14",
            borderWidth: 3,
            fill: false,
            tension: 0.45,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: `Income vs Expenses vs Balance (${currentYear})`,
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `₹${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => `₹${v.toLocaleString()}`,
            },
          },
        },
      },
    });
  }, [visibleLabels, visibleIncome, visibleExpense, visibleBalance, currentYear]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ===============================
  // UI
  // ===============================
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark black-navbar">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold text-white">
            <i className="fas fa-chart-line me-2"></i>
            FinanceTracker Pro
          </span>

          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/transactions">Transactions</Link>
              </li>
              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/category_list">Categories</Link>
              </li>
              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/budget_list">Budget</Link>
              </li>
              <li className="nav-item ms-3">
                <Link className="nav-link text-white" to="/analytics">Analytics</Link>
              </li>

              <li className="nav-item dropdown ms-3">
                <button className="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                  {username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="container mt-5 pt-4">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6>Summary</h6>
                <p>Income: ₹{totalIncome}</p>
                <p>Expenses: ₹{totalExpenses}</p>
                <p>Balance: ₹{netBalance}</p>

                <hr />
                <h6 className="small">Top Expenses</h6>
                <ul className="small">
                  {topExpenses.length === 0 && <li>No data</li>}
                  {topExpenses.map((e, i) => (
                    <li key={i}>
                      {e.category} — ₹{e.amount} ({e.percentage}%)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card" style={{ height: "600px" }}>
              <div className="card-header d-flex justify-content-between">
                <strong>Last {months} months</strong>
                <div className="btn-group">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      className={`btn btn-sm ${months === m ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setMonths(m)}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-3 pt-2">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={months}
                  className="form-range"
                  onChange={(e) => setMonths(Number(e.target.value))}
                />
              </div>

              <div className="card-body">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
