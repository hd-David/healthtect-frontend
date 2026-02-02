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

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  // Keep token in sync with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  // Memoized login/logout handlers
  const handleLogin = useCallback((newToken) => {
    setToken(newToken);
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={() => {}} />} />
        <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/user" element={token ? <User token={token} /> : <Navigate to="/login" replace />} />
        <Route path="/hospital" element={token ? <Hospital token={token} /> : <Navigate to="/login" replace />} />
        <Route path="/studies" element={token ? <Study token={token} /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
