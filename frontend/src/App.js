import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HRLogin from './pages/HRLogin';
import EmployeeLogin from './pages/EmployeeLogin';
import HRForgot from './pages/HRForgot';
import HRDashboard from './pages/HRDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeePortal from './pages/EmployeePortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hr-login" element={<HRLogin />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/hr-forgot" element={<HRForgot />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/employee-portal" element={<EmployeePortal />} />
      </Routes>
    </Router>
  );
}

export default App;
