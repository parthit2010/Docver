import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Link,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AlertBox from '../components/AlertBox';



// Theme customization
const theme = createTheme();

export default function Register() {

  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation
  const [success, setSuccess] = useState(false); // Success alert state
  const [error, setError] = useState(''); // Error message state
  const [open, setOpen] = useState(false); // Success alert state



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleAlertClose = () => {
  setSuccess(false);
  navigate('/login'); // Navigate to login on success
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
      //confirmPassword: data.get('confirmPassword'),
    });

    try {
      const response = await fetch('http://localhost:3000/api/customers/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
          setMessage('Registration successful!');
          setFormData({ username: '', email: '', password: '', confirmPassword : '' });
          setSuccess(true); // Show success alert
          setOpen(true);
          setError(''); // Clear any previous error
      } else {
          setMessage(data.message || 'Registration failed');
          setError(data.message || 'Registration failed'); // Show error alert
      }
  } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again.');
  }

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">

      <Dialog open={open} onClose={handleAlertClose}>
                <DialogTitle>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <CheckCircleIcon style={{ fontSize: 50, color: 'green' }} />
                        <Typography variant="h6" style={{ marginTop: '0.5rem' }}>Registration Successful</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography align="center">Your registration was successful! Click "OK" to go to the login page.</Typography>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={handleAlertClose} color="primary" variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        <CssBaseline />

        {success && (
                <Stack spacing={2}>
                    <Alert
                        severity="success"
                        action={
                            <Button color="inherit" size="small" onClick={handleAlertClose}>
                                OK
                            </Button>
                        }
                    >
                        Registration successful! Click "OK" to go to the login page.
                    </Alert>
                </Stack>
            )}

            {error && (
                <Alert severity="error" style={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            )}

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo/Icon */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Link href="/login" variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
          </Box>
        </Box>
      
      </Container>
    </ThemeProvider>
  );
}
