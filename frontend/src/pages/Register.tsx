import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // ✅ add eye icons
import '../assets/scss/login.scss'; // ✅ reuse same styles

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false); // ✅ state for eye toggle
  const nav = useNavigate();

  function validateEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  // ✅ Field validation
  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'username') {
      if (!value.trim()) error = 'Username is required';
      else if (value.trim().length < 3) error = 'Username must be at least 3 characters';
    }

    if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!validateEmail(value)) error = 'Enter a valid email';
    }

    if (name === 'password') {
      if (!value.trim()) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submit
    const usernameError = validateField('username', username);
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);

    if (usernameError || emailError || passwordError) return;

    try {
      await api.post('/auth/register', { username, email, password });
      toast.success('Registration successful');
      nav('/login');
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <div className="box">
      <h1>Create Account</h1>
      <p>Sign up to get started</p>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="username">Username</label>
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

        {/* Email Field */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateField('email', e.target.value)}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Password Field with Eye Toggle */}
        <div className="password-wrapper" style={{ marginBottom: 8 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'} // ✅ eye toggle
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

        <button type="submit">Create Account</button>

        <div>
          <p>
            Already have an account? <Link to="/Login">Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
