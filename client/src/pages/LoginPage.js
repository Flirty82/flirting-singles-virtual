/* eslint-disable no-unused-vars */
import  React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Typography, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { theme } from '../styles/theme';
import {
    Email,
    Lock,
    Visibility,
    Google,
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    GitHub,
    FavoriterBorder,
    Favorite
} from '@mui/icons-material';
import { ClientEncryption } from 'mongodb';

const LoginPageContainer = styled.div`
min-height: 100vh;
display: flex;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
align-items: center;
position: relative;
overflow: hidden;
`;

const BackgroundPattern = styled.div`
position: absolute;
width: 100%;
height: 100%;
opacity: 0.1;
background-image: url('/images/background-pattern.png');
background-size: cover;
background-position: center;
`;

const LefSection = styled.div`
flex: 1;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
color: white;
padding: 40px;
`;

const LoginCard = styled(motion.div)`
background: white;
border-radius: 20px;
padding: 50px;
width: 100%;
max-width: 450px;
display: flex;
}
`;

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, signInWithGoogle, resetPassword } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Get redirect path from location state or default to profile
    const from = location.state?.from?.pathname || '/profile';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await signIn(formData.email, formData.password);
            toast.success('Welcome back!');

            // Redirect to profile page after successful login
           navigate('/profile');
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again or contact our support team');
            } else ic (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address');
            } else {
                setError('Failed to login. Please try again');
            }
        } finally {
            setIsLoading(false);
        }
        };

        const handleGoogleLogin = async () => {
            try {
            await signInWithGoogle();
            toast.success('Welcome back!');
            navigate('/profile');
        } catch (err) {
            setError('Failed to login with Google');
        }
        };

        const handleForgotPassword = async () => [
            if (!formData.email) {
                toast.error('Please enter your email address first');
                return;
            }

            try {
                await resetPassword(formData.email);
                toast.success('Password reset email sent! Check your email');
            } catch (err) {
                toast.error('Failed to send reset email');
            }
        };

        // Floating hearts animation
        const hearts = Array.from({ length: 6 }, (_, i) => ({
            id: i,
            size: Math.random() * window.innerWidth,
            duration: Math.random() * 20 + 10
        }));

        return (
            <LoginContainer>
                <BackgroundPattern/>

                {hearts.map(heart => (
                    <FloatingHeart
                      key={heart.id}
                      size={heart.size}
                      initial={{ x: heart.initialX, y: window.innerHeight + 100 }}
                      animate={{
                        y: -100,
                        x: heart.initialX + (Math.random() * 200 - 100)
                      }}
                      transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    ></FloatingHeart>
                ))}

                <LeftSection>
                    <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.6 }}
                    >
                        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: '700' }}>
                            Start flirting today!
                        </h1>
                        <p style={{ fontSize: '20px', opactiy: 0.9, lineHeight: 1.6 }}>
                            Join thousands of singles who have found companionship. Your 
                            new journey begins here.
                        </p>
                    </motion.div>
                </LeftSection>

                <RightSection>
                    <LoginCard
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.5 }}
                    >
                        <Logo>
                            <LogoIcon>
                                <Favorite style={{ fontSize: 40, color: 'white' }}/>
                            </LogoIcon>
                            <Title>Welcome Back!</Title>
                            <Subtitle>Login to meet, flirt, and connect</Subtitle>
                        </Logo>

                        {error && (
                            <ErrorMessage
                               initial={{ opacity: 0, y: -10 }}
                               animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </ErrorMessage>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <InputGroup>
                              <InputIcon>
                              <Email />
                              </InputIcon>
                              <InputDeviceInfo
                                 type="email"
                                 name="email"
                                 placeholder="Enter your email"
                                 value={formData.email}
                                 onChange={handleChange}
                                 required
                            />
                            </InputGroup>

                            <InputGroup>
                              <InputIcon>
                                <Lock />
                              </InputIcon>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              placeholder="Enter your password"
                              value={fomrData.password}
                              onChange={handleChange}
                              required
                            />
                            <PasswordToggle
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            ></PasswordToggle>
                            </InputGroup>

                            <RememberForgot>
                                <CheckboxLabel>
                                    <input 
                                      type="checkbox"
                                      checked={rememberMe}
                                      onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Remember me 
                                </CheckboxLabel> 
                                <Forgotink type="button" onClick={handleForgotPassword}>
                                    Forgot password?
                                </ForgotLink>
                            </RememberForgot>

                            <SubmitButton
                              type="submit"
                                disabled={loading}
                                whileHove="scale(1.02)"
                                whiteTap="scale(0.98)"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </SubmitButton>
                        </Form>

                        <Divider>
                            <span>OR</span>
                        </Divider>

                        <SocialButtons>
                            <SocialButton brand="google" onClick={handleGoogleLogin}>
                                <Google />
                                Google
                            </SocialButton>
                            <SocialButton brand="facebook">
                                <Facebook />
                                Facebook
                        </SocialButton>

                        <SignupLink>
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </SignupLink>

                    </LoginCard>
                </RightSection>
            </LoginContainer>
        );



