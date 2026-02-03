import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './FormStyles.css';
import Landing from './components/Landing';
import User from './components/User';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Hospital from './components/Hospital';
import Study from './components/Study';
import AccessLogs from './components/AccessLogs';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import InviteUser from './components/InviteUser';
import AcceptInvitation from './components/AcceptInvitation';
import AIResult from './components/AIResult';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  });

  // Keep token and user in sync with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    }
  }, [user]);

  // Memoized login/logout handlers
  const handleLogin = useCallback((newToken, userInfo) => {
    setToken(newToken);
    setUser(userInfo);
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={() => {}} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout} user={user} token={token} /> : <Navigate to="/" replace />} />
        <Route path="/user" element={token ? <User token={token} user={user} /> : <Navigate to="/" replace />} />
        <Route path="/invite" element={token ? <InviteUser token={token} user={user} /> : <Navigate to="/" replace />} />
        <Route path="/hospital" element={token ? <Hospital token={token} user={user} /> : <Navigate to="/" replace />} />
        <Route path="/studies" element={token ? <Study token={token} user={user} /> : <Navigate to="/" replace />} />
        <Route path="/results" element={token ? <AIResult token={token} user={user} /> : <Navigate to="/" replace />} />
        <Route path="/logs" element={token ? <AccessLogs token={token} user={user} /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
