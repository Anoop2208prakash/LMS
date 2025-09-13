import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../assets/scss/dashboard.scss";

type User = {
  id: number;
  username: string;
  email?: string;
  role: "admin" | "super_admin" | "user";
  created_at?: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<User>("/auth/me");
        setUser(res.data);
      } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || "Unable to fetch profile");
        localStorage.removeItem("token");
        nav("/login");
      }
    })();
  }, [nav]);

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <Navbar user={user} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main">
        <h1>Welcome, {user.username}</h1>
        <p>
          Your role: <strong>{user.role}</strong>
        </p>

        {/* ✅ Attendance (Visible to everyone) */}
        <div className="attendance-containers">
          <div className="attendance-card present">
            <div className="card-content">
              <h2>20</h2>
              <p>Present</p>
              <span>of 30 total</span>
            </div>
            <div className="progress-circle">
              <svg viewBox="0 0 36 36">
                <path
                  className="bg"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="progress"
                  strokeDasharray="67, 100"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="percent">67%</span>
            </div>
          </div>

          <div className="attendance-card absent">
            <div className="card-content">
              <h2>5</h2>
              <p>Absent</p>
              <span>of 30 total</span>
            </div>
            <div className="progress-circle">
              <svg viewBox="0 0 36 36">
                <path
                  className="bg"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="progress"
                  strokeDasharray="17, 100"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="percent">17%</span>
            </div>
          </div>

          <div className="attendance-card leave">
            <div className="card-content">
              <h2>2</h2>
              <p>Leave</p>
              <span>of 30 total</span>
            </div>
            <div className="progress-circle">
              <svg viewBox="0 0 36 36">
                <path
                  className="bg"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="progress"
                  strokeDasharray="6, 100"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="percent">6%</span>
            </div>
          </div>
        </div>

        {/* ✅ Role-specific extra features */}
        {user.role === "admin" && (
          <div className="admin-tools">
            <h2>Admin Tools</h2>
            <ul>
              <li>Manage users</li>
              <li>Generate reports</li>
              <li>System configuration</li>
            </ul>
          </div>
        )}

        {user.role === "super_admin" && (
          <div className="super_admin-tools">
            <h2>Super Admin Tools</h2>
            <ul>
              <li>Manage admins</li>
              <li>Global system settings</li>
              <li>Access full logs</li>
            </ul>
          </div>
        )}

        {user.role === "user" && (
          <div className="user-tools">
            <h2>User Features</h2>
            <ul>
              <li>View personal attendance</li>
              <li>Submit leave requests</li>
              <li>Check notifications</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
