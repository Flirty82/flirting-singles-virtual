/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    Alert,
    InputAdorment,
    IconButton,
    Grid,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Google,
    Facebook,
    Favorite
} from '@mui/icons/material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const { signIn, resetPassword } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signIn(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            toast.error('Please enter your email first');
            return;
        }

        try {
            await resetPassword(formData.email);
        } catch (err) {
            toast.err('Failed to send reset email');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx = {{ textAlign: 'center', mb: 4 }}>
                    <Favorite sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}/>
                    <Typography variant="h4" gutterBottom>
                        Welcome Back!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Login to start flirting
                    </Typography>
                </Box>

                {error && (
                    <Alert serverity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                       fullWidth
                       label="Email Address"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       required
                       sx={{ mb:2 }}
                       InputProps={{
                        startAdorment: (
                            <InputAdorment position="start">
                                <Email/>
                            </InputAdorment>
                        )
                       }}
                    />

                    <TextField
                      fullWidthlabel="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      sx={{ mb:1 }}
                      InputProps={{
                        startAdorment: (
                            <InputAdorment position="start">
                                <Lock/>
                            </InputAdorment>
                        ),
                        endAdorment: (
                            <InputAdorment position="end">
                                <IconButton
                                   onClick={() => setShowPasswrod(!showPassword)}
                                   edge="end"
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility />}
                                </IconButton>
                            </InputAdorment>
                        )
                      }}
                    />

                    <Box sx={{ textAlign: 'right', mb: 2 }}>
                        <Button 
                          size="small"
                          onClick={handleForgotPassword}
                          sx={{ textTransform: 'none' }}
                        >
                            Forgot Password
                        </Button>
                    </Box>

                    <Button 
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ mb: 2 }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>OR</Divder>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Google/>}
                          sx={{ textTransform: 'none' }}
                        >
                            Google
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Facebook/>}
                          sx={{ textTransform: 'none' }}
                        >
                            Facebook
                        </Button>
                    </Grid>
                </Grid>
                
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#E91E63', textDecoration: 'none' }}>
                          Sign UP
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
