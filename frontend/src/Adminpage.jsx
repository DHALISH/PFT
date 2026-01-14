import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Adminpage.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/users/", {
      headers: {
        Authorization: `Token ${token}`, // ✅ FIXED
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Access denied");
        }
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch(() => alert("Access denied"));
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="black-navbar fixed-top navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-white" href="#">
            FinanceTracker Pro
          </a>

          <ul className="navbar-nav ms-auto align-items-end">
            <li className="nav-item dropdown ">
              <button
                className="btn btn-light btn-sm dropdown-toggle"
                data-bs-toggle="dropdown"
              >
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
      </nav>

      <div style={{ marginTop: "80px" }}></div>

      {/* Admin Users Table */}
      <div className="container mt-4">
        <h3 className="mb-4">👥 Admin – All Users</h3>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email || "—"}</td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminUsers;
