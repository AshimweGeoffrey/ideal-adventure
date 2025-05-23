import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './services/AuthContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PortfolioForm from './components/PortfolioForm';
import PortfolioDetail from './components/PortfolioDetail';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import PublicPortfolios from './components/PublicPortfolios';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="container mt-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/public" element={<PublicPortfolios />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/portfolio/new" element={
                <ProtectedRoute>
                  <PortfolioForm />
                </ProtectedRoute>
              } />
              <Route path="/portfolio/edit/:id" element={
                <ProtectedRoute>
                  <PortfolioForm />
                </ProtectedRoute>
              } />
              <Route path="/portfolio/:id" element={
                <ProtectedRoute>
                  <PortfolioDetail />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <footer className="bg-dark text-light text-center py-3 mt-5">
            <div className="container">
              <p className="mb-0">Portfolio System 26466 &copy; 2024</p>
              <small>Secure CRUD System with JWT & API Key Authentication</small>
            </div>
          </footer>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
