import React, { useState } from 'react';
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
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useNavigate } from 'react-router-dom';

// Theme customization
const theme = createTheme();


export default function Login() {
  const [error, setError] = useState(''); // Error message state
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '',  password: '' });


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password')
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    if (email == "admin" && password == "admin"){
      localStorage.setItem("token", "admin");
      navigate('/documents');
    }else{
      const response = await fetch('http://localhost:3000/api/customers/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email,  password: password })
    });

    const data = await response.json();
    console.log(data);
    console.log(data.id);
    if (response.ok) {
      localStorage.setItem("token", data.id);
      navigate('/customer');
    } else {
      //alert("Login Failed");
      setError(data.message || 'Login failed'); // Show error alert
    }

    }



  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
          {/* Logo */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
          </Box>
        </Box>
      
      </Container>
    </ThemeProvider>
  );
}
