/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-dupe-keys */
/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import VirtualDating from './pages/VirtualDating';
import './App.css';

// Components
import Navigation from 'flirting-singles-virtual/client/src/components/common/Navigation';
import Header from 'flirting-singles-virtual/client/src/components/common/Header';
import Footer from 'flirting-singles-virtual/client/src/components/common/Footer';
import PrivateRoute from 'flirting-singles-virtual/client/src/components/common/PrivateRoute';
import LoadingSpinner from 'flirting-singles-virtual/client/src/components/common/LoadingSpinner';

// Pages
import WelcomePage from '/flirting-singles-virtual/client/src/pages/WelcomePage';
import LoginPage from '/flirting-singles-virtual/client/src/pages/LoginPage';
import SignupPage from '/flirting-singles-virtual/client/src/pages/SignupPage';
import UserProfilePage from '/flirting-singles-virtual/client/src/pages/UserProfilePage';
import DashboardPage from '/flirting-singles-virtual/client/src/pages/DashboardPage';
import MembershipsPage from '/flirting-singles-virtual/client/src/pages/MembershipsPage';
import ContactPage from '/flirting-singles-virtual/client/src/pages/ContactPage';
import ChatPage from '/flirting-singles/virtual/client/src/pages/ChatPage';
import ActivityFeedPage from 'flirting-singles-virtual/client/src/pages/ActivityFeedPage';
import UserProfileSetupPage from 'flirting-singles-virtual/client/src/pages/UserProfileSetupPage';
import MessagesPage from 'flirting-singles-virtual/client/src/pages/MessagesPage';
import BingoGamePage from 'flirting-singles-virtual/client/src/pages/BingoGamePage';
import KaraokeGamePage from 'flirting-singles-virtual/client/src/pages/KaraokeGamePage';
import ParanormalActivityGamePage from 'flirting-singles-virtual/client/src/pages/ParanormalActivityGamePage';
import TruthOrDareGamePage from 'flirting-singles-virtual/client/src/pages/TruthOrDareGamePage';
import DiscoverPage from 'flirting-singles-virtual/client/src/pages/DiscoverPage';
import FlirtsPage from 'flirting-singles-virtual/client/src/pages/FlirtsPage';

// Context
import { AuthProvider } from 'flirting-singles-virtual/client/src/context/AuthContext';
import { useAuth } from 'flirting-singles-virtual/client/src/hooks/useAuth';

const App = () => {
    return (
        <AuthProvider>
            <MainApp/>
        </AuthProvider>
    );
};

const MainApp = () => {
    const [currentPage, setCurrentPage] = useState('welcome');
    const { user, login, logout, signup, loading } = useAuth();

    // Handle PayPal return (when user comes back from PayPal)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paypalReturn = urlParams.get('paypalReturn');
        const subscriptionId = urlParams.get('subscriptionId');

        if (paypalReturn && subscriptionId) {
            // Update user subscription based on PayPal success
            // Verify this with backend if needed
            alert('Payment successful! Subscription ID: ' + subscriptionId);
            setCurrentPage('dashboard');
            // Optionally, update user subscription status in context or global state
        }
    }, [user]);

    const renderPage = () => {
        switch(currentPage) {
            case 'welcome':
                return <WelcomePage onLogin={() => setCurrentPage('login')} onSignup={() => setCurrentPage('signup')}/>;
            case 'login':
                return <LoginPage onLoginSuccess={() => setCurrentPage('dashboard')} onBack={() => setCurrentPage('welcome')} Login={login}/>;
            case 'signup':
                return <SignupPage onSignupSuccess={() => setCurrentPage('dashboard')} onBack={() => setCurrentPage('welcome')} Signup={signup}/>;
            case 'dashboard':
                return <DashboardPage user={user} onLogout={() => { logout(); setCurrentPage('welcome'); }}/>;
            case 'profile':
                return <UserProfilePage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'memberships':
                return <MembershipsPage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'contact':
                return <ContactPage onBack={() => setCurrentPage('dashboard')}/>;
            case 'messages':
                return <MessagePage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'virtual-dating':
                return <VirtualDating user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'discover':
                return <DiscoverPage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'flirts':
                return <FlirtsPage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'feed':
                return <ActivityFeedPage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'chat':
                return <ChatPage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'setup-profile':
                return <UserProfileSetupPage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'bingo':
                return <BingoGamePage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'karaoke':
                return <KaraokeGamePage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'paranormal-activity':
                return <ParanormalActivityGamePage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            case 'truth-or-dare':
                return <TruthOrDareGamePage user={user} onBack={() => setCurrentPage('dashboard')}/>;
            default:
                return <WelcomePage onLogin={() => setCurrentPage('login')} onSignup={() => setCurrentPage('signup')}/>;
        }
    };

    return (
        <div className="app-container">
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} user={user} logout={() => { logout(); setCurrentPage('welcome'); }}/>
            <main className="main-content">
                {renderPage()}</main>
            <Footer />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
        </div>
    )
}

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
