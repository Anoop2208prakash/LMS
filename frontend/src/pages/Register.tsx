import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"; // ✅ icons
import "../assets/scss/login.scss";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  function validateEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "username") {
      if (!value.trim()) error = "Username is required";
      else if (value.trim().length < 3) error = "Username must be at least 3 characters";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!validateEmail(value)) error = "Enter a valid email";
    }

    if (name === "password") {
      if (!value.trim()) error = "Password is required";
      else if (value.length < 6) error = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const usernameError = validateField("username", username);
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (usernameError || emailError || passwordError) return;

    try {
      await api.post("/auth/register", { username, email, password });
      toast.success("Registration successful! Please log in.");
      nav("/login");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="box">
      <h1>Create Account</h1>
      <p>Sign up to get started</p>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label htmlFor="username" className="label-with-icon">
            <User size={16} /> <span>Username</span>
          </label>
          <input
            id="username"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => validateField("username", e.target.value)}
            className={errors.username ? "error" : ""}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="label-with-icon">
            <Mail size={16} /> <span>Email</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateField("email", e.target.value)}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="password-wrapper">
          <label htmlFor="password" className="label-with-icon">
            <Lock size={16} /> <span>Password</span>
          </label>
          <div className="password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validateField("password", e.target.value)}
              className={errors.password ? "error" : ""}
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit">Create Account</button>

        <div>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
