
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PickupDashboard from './pages/PickupDashboard';
import SubmitEwaste from './pages/SubmitEwaste';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/user' element={<ProtectedRoute allowedRoles={['user']}><UserDashboard/></ProtectedRoute>} />
        <Route path='/submit' element={<ProtectedRoute allowedRoles={['user']}><SubmitEwaste/></ProtectedRoute>} />
        <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard/></ProtectedRoute>} />
        <Route path='/pickup' element={<ProtectedRoute allowedRoles={['pickup']}><PickupDashboard/></ProtectedRoute>} />
        <Route path='*' element={<div className="p-8">Page not found</div>} />
      </Routes>
    </Router>
  );
}
