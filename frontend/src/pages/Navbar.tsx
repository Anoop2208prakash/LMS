import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/scss/navbar.scss";

type User = {
  id: number;
  username: string;
  email: string;
  role?: string; // ✅ Added role field
};

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      nav("/login");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="navbar">
      {/* Left side - Logo */}
      <div className="navbar-logo">LMS</div>

      {/* Right side - Profile */}
      <div className="navbar-profile" ref={dropdownRef}>
        {user ? (
          <>
            {/* Circle with first letter */}
            <div className="profile-circle" onClick={() => setOpen(!open)}>
              {user.username.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown */}
            {open && (
              <div className="profile-dropdown">
                <p className="profile-username">{user.username}</p>
                <p className="profile-email">{user.email}</p>
                {user.role && (
                  <p className="profile-role">Role: {user.role}</p>
                )}
                <hr className="dropdown-separator" />
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="loading-text">Loading...</p>
        )}
      </div>
    </nav>
  );
}
