/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-dupe-keys */
/*eslint-disable no-unused-vars*/
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from '/flirting-singles-virtual/client/src/pages/Home';
import Login from '/flirting-singles-virtual/client/src/pages/Login';
import Signup from '/flirting-singles-virtual/client/src/pages/Signup';
import Profile from '/flirting-singles-virtual/client/src/pages/Profile';
import Dashboard from '/flirting-singles-virtual/client/src/pages/Dashboard';
import Memberships from '/flirting-singles-virtual/client/src/pages/Memberships';
import Contact from '/flirting-singles-virtual/client/src/pages/Contact';
import Messages from '/flirting-singles/virtual/client/src/pages/Messages';

// Theme Configuration
const theme = createTheme({
    palette: {
        primary: {
            main: '#E91E63', // Pink for dating theme
            light: '#F8BBD0',
            dark: '#C2185B',
        },
        secondary: {
            main: '#9C27B0', // Purple
            light: '#E1BEE7',
            dark: '#7B1FA2',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: ' "Roboto","Helvetica", "Arial", sans-serif',
        h1: {
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
    },
});

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
            <CssBaseline />
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>
                        {/*Public Routes*/}
                        <Route path="/" element={<Home/>}/>
                        <Route path="/Login" element={!user ? <Login/> : <Navigate to="/dashboard"/>}/>
                        <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/dashboard"/>}/>
                        <Route path="/memberships" element={<Memberships/>}/>
                        <Route path="/contact" element={<Contact/>}/>

                        {/*Protected Routes*/}
                        <Route element={<PrivateRoute/>}/>
                          <Route path="/dashboard" element={<Dashboard/>}/>
                          <Route path="/profile/:userId?" element={<Profile/>}/>
                          <Route path="/messages" element={<Messages/>}/>
                          <Route path="/virtual-dating" element={<VirtualDating/>}/>
                    </Routes>
                </main>
            </div>
        </ThemeProvider>
    );
}

export default App;
