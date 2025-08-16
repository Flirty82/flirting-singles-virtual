/* eslint-disable no-dupe-keys */
/*eslint-disable no-unused-vars*/
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import RoutesContainer from './RoutesContainer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navigation/Navbar';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Memberships from './pages/Memberships';
import Contact from './pages/Contact';
import Messages from './pages/Messages';
import VirtualDating from './pages/VirtualDating';

// Styles
import './styles/globals.css';
import './styles/variables.css';
import './styles/components.css';

// Protected Route Component
const ProtectiveRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return currentUser ? children : <Navigate to="/Login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return !currentUser ? children : <Navigate to="/dashboard" />;
};

function AppComponent() {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="app-loading">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="app">
            {currentUser && <Navbar />}
            <main className={'main-content ${currentUser ? "with-navbar" : ""}'}>
                <Routes>
                    {/*Public Routes*/}
                    <Route path="/" element={<PulicRoute>
                        <Home />
                    </PulicRoute>
                    }/>
                    <Route path="login" element={<PublicRoute>
                        <Login />
                    </PublicRoute>}/>
                    <Route path="signup" element={<PublicRoute>
                        <Signup />
                    </PublicRoute>}/>

                    {/*Protected Routes*/}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                       path="/profile/:userId?"
                       element={
                        <ProtectedRoute>
                            <Proifle />
                        </ProtectedRoute>
                       }
                    />
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                       path="settings"
                       element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                       }
                    />
                    
                    {/*Catch all route*/}
                    <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"}/>} />

                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

// Theme configuration
const theme = createTheme({
    palette: {
        primary: {
            main: '#E91E63', // Pink for dating theme
            light: '#F8BBD0',
            dark:'#e9ccd8ff',
        },
        secondary: {
            main: '#9C27B0',
            light: '#E1BEE7',
            dark: '#7B1FA2'
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: ' "Roboto", "Helvetica", "Arail", sans-serfic',
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    }
});

const paypalOptions = {
    "client-id": process.env.REACT_APP_PAYPAY_CLIENT_ID,
    currency: "USD",
    intent: "subscription",
};

function App() {
    const { user, loading } = useAuth();

    useEffect(() => {
        // Initialize socket connection when user logs in
        if (user) {
            // Socket initialization will be handled in a separate service
            console.log('User logged in:', user.uid);
        }
    }, [user]);

    if (loading) {
        return <LoadingSpinner fullScreen/>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="app">
                <Header/>
                <main className="main-content">
                    <Routes>
                        {/*Public Routes*/}
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/memberships" element={<Memberships/>}/>
                        <Route path="/contact" element={<Contact/>}/>

                        {/*Protected Routes*/}
                        <Route element={<PrivateRoute/>}>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/profile/:userId?" element={<Profile/>}/>
                        <Route path="/messages" element={<Messages/>}/>
                        <Route path="/virtual-dating" element={<VirtualDating/>}/>
                        </Route>

                        
                    </Routes>
                </main>
            </div>
        </ThemeProvider>
    )
}

export default App;