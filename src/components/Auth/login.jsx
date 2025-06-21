import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onSuccessRedirect = '/dashboard', forgotPasswordUrl, signupUrl }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const savedUser = JSON.parse(localStorage.getItem('mockUser'));

      if (savedUser && savedUser.username === username && savedUser.password === password) {
        navigate(onSuccessRedirect); // automatic redirect to dashboard
      } else {
        setError('Invalid username or password.');
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>Admin Login</Typography>

        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
          <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          {forgotPasswordUrl && (
            <Link href={forgotPasswordUrl} underline="hover">Forgot Password?</Link>
          )}
          {signupUrl && (
            <Link href={signupUrl} underline="hover">Create Account</Link>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
