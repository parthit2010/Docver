import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Documents from './pages/Documents';
import CreateDocument from './pages/CreateDocument';
import EditDocument from './pages/EditDocument';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Welcome to Blockchain Based Document Verification System in Banking</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/customer" element={ <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute>
              <Documents />
            </ProtectedRoute>} />
          <Route path="/documents/create" element={<ProtectedRoute>
              <CreateDocument />
            </ProtectedRoute>} />
          <Route path="/documents/edit/:id" element={<ProtectedRoute>
              <EditDocument />
            </ProtectedRoute>} />
          {/* <Route path="/documents/verify" element={<VerifyDocument />} /> */}

          </Routes>
      </Container>
    </Router>
  );
}

export default App;
