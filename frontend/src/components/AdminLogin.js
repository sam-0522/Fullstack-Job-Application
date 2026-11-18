
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from '@mui/material';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        config.backendUrl + '/api/auth/login',
        {
          email: email.trim(),
          password
        }
      );

      if (!response.data?.token) {
        setError('Login failed. Please try again.');
        return;
      }

      onLoginSuccess(
        response.data.token,
        response.data.admin
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="inner-page"
      sx={{ maxWidth: 450, mx: 'auto' }}
    >
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage CareerConnect.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            margin="normal"
            autoComplete="username"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            margin="normal"
            autoComplete="current-password"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={onCancel}
            sx={{ mt: 1 }}
          >
            Back to Jobs
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
