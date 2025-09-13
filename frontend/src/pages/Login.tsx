import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react'; // ✅ added User & Lock icons
import '../assets/scss/login.scss';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  // ✅ Field validation
  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'username') {
      if (!value.trim()) error = 'Username is required';
      else if (value.trim().length < 3) error = 'Username must be at least 3 characters';
    }

    if (name === 'password') {
      if (!value.trim()) error = 'Password is required';
      else if (value.trim().length < 6) error = 'Password must be at least 6 characters';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);

    if (usernameError || passwordError) return;

    try {
      // ✅ Expect token + role from backend
      const res = await api.post<{ token: string; role: string }>('/auth/login', { username, password });
      const { token, role } = res.data;

      // ✅ Store token + role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      toast.success('Login successful');

      // ✅ Go to dashboard
      nav('/dashboard');
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <div className="box">
      <h1>Welcome</h1>
      <p>Sign in to your account</p>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label htmlFor="username">
            <User size={16} style={{ marginRight: '6px' }} /> Username
          </label>
          <input
            id="username"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => validateField('username', e.target.value)}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        {/* Password with Eye */}
        <div className="password-wrapper">
          <label htmlFor="password">
            <Lock size={16} style={{ marginRight: '6px' }} /> Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) => validateField('password', e.target.value)}
            className={errors.password ? 'error' : ''}
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit">Sign In</button>

        <div>
          Don&apos;t have an account? <Link to="/Register">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
