import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import './DashBoard.css';
import api from "../api";

const Login = () => {
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  });
  
  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    const res = await api.post('/auth/login', { // Updated
      username: loginForm.username,
      password: loginForm.password
    });

      // Save token and user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Login successful!');
      
      // ✅ REDIRECT TO DASHBOARD
      navigate('/dashboard');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (registerForm.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (registerForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

   try {
    await api.post('/auth/register', { // Updated
      username: registerForm.username,
      password: registerForm.password,
      role: registerForm.role
    });

      toast.success('Account created! Please login.');
      setRegisterForm({ username: '', password: '', confirmPassword: '', role: 'staff' });
      setAuthMode('login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>🏥 Vijayapur Scanning Centre</h1>
          <p>{authMode === 'login' ? 'Login to your account' : 'Create new account'}</p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            className={authMode === 'login' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setAuthMode('login')}
          >
            Login
          </button>
          <button
            className={authMode === 'register' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setAuthMode('register')}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                placeholder="Choose username (min 3 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Enter password (min 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                required
              />
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                value={registerForm.role}
                onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
              >
                <option value="staff">Staff</option>
              
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;