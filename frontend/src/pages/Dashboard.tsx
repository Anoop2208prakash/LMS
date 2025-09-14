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
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Your role:</strong> {user.role}
        </p>
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
