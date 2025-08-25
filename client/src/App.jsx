import React, { useStat, useEffect } from 'react';
import './App.css';

// Components
import Navigation from 'flirting-singles-virtual/client/src/components/Navigation';
import HomePage from 'flirting-singles-virtual/client/src/pages/HomePage';
import LoginPage from 'flirting-singles-virtual/client/src/pages/LoginPage';
import SignupPage from 'flirting-singles-virtual/client/src/pages/SignupPage';
import ContactPage from 'flirting-singles-virtual/client/src/pages/ContactPage';
import MembershipsPage from 'flirting-singles-virtual/client/src/pages/MembershipsPage';
import ActivityFeedPage from 'flirting-singles-virtual/client/scr/pages/ActivityFeedPage';
import ChatPage from 'flirting-singles-virtual/client/src/pages/ChatPage';
import UserProfilePage from 'flirting-singles-virtual/client/src/pages/UserProfilePage';
import BingoGamePage from 'flirting-singles-virtual/client/src/pages/BingoGamePage';
import KaraokeGamePage from 'flirting-singles-virtual/client/src/pages/KaraokeGamePage';

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
    const { user, login, logout, signup } = useAuth();

    const renderPage = () => {
        switch(currentPage) {
            case 'home':
                return <WelcomePage setCurrentPage={setCurrentPage}/>
            case 'login':
                return <LoginPage setCurrentPage={setCurrentPage} onLogin={login}/>
            case 'signup':
                return <SignupPage setCurrentPage={setCurrentPage} onSignup={signup}/>
            case 'memberships':
                return <MembershipsPage/>;
            case 'contact':
                return <ContactPage/>;
            case 'feed':
                return user ? <ActivityFeedPage/> : <LoginPage setCurrentPage={setCurrentPage} onLogin={login}/>;
            case 'chat':
                return user ? <ChatPage/> : <LoginPage setCurrentPage={setCurrentPage} onLogin={login}/>;
            case 'profile':
                return user ? <UserProfilePage/> : <LoginPage setCurrentPage={setCurrentPage} onLogin={login}/>;
            case 'bingo':
                return user ? <BingoPage/> : <LoginPage setCurrentPage={setCurrentPage} onLogin={login}/>;
            case 'karaoke':
                return user ? <KaraokePage/> : <LoginPage setCurrentPage={setCurrentPage} onLogin={login}/>;
            default:
                return <WelcomePage setCurrentPage={setCurrentPage}/>;
        }
    };

    return (
        <div className="app-container">
            <Navigation
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              user={user}
              onLogout={logout}
            />
            <main className="main-content">
                {renderPage()}
            </main>
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2025 Flirting Singles</p>
                </div>
            </footer>
        </div>
    );
};

export default App;