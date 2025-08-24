/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { createRoom } from 'react-dom/client';
import './styles/variables.css';
import './styles/globals.css';
import '.styles/typography.css';
import './styles/buttons.css';
import './styles/cards.csss';
import './styles/fomrs.css';
import './styles/alerts.css';
import './styles/animations.css';
import './styles/responsive.css';
import './styles/transitions.css';
import './styles/icons.css';
import { Toaster } from 'react-hot-toaster';
import { ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

// Import app and store
import { store } from './store/store';

// Import styles
import './index.css';
import './styles/globals.css';
import './styles/variables.css';
import './styles/typography.css';
import './styles/buttons/css';
import './styles/cards.css';
import './styles/forms.css';
import './styles/alerts.css';

// Import Firebase Config
import './config/firebase';

export { default as HomePage } from 'flirting-singles-virtual/client/src/pages/HomePage';
export { default as LoginPage } from 'flirting-singles-virtual/client/src/pages/LoginPage';
export { default as SignupPage } from 'flirting-singles-virtual/client/src/pages/SignupPage';
export { default as ContactPage } from 'flirting-singles-virtual/client/src/pages/ContactPage';
export { default as MembershipPage } from 'flirting-singles-virtual/client/src/pages/MembershipPage';
export { default as ActivityFeedPage } from 'flirting-singles-virtual/client/src/pages/ActivityFeedPage';
export { default as ChatPage } from 'flirting-singles-virtual/client/src/pages/ChatPage';
export { default as ProfilePage } from 'flirting-singles-virtual/client/src/pages/ProfilePage';
export { default as BingoPage } from 'flirting-singles-virtual/client/src/components/games/BingoPage';
export { default as KaraokePage } from 'flirting-singles-virtual/client/src/components/games/KaraokePage';
export { default as ParanormalActivityPage } from 'flirting-singles-virtual/client/src/components/games/ParanormalActivityPage';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E91E63', // Pink for dating app
      light: '#F8BBD0',
      dark: '#C2185B',
    },
    secondary: {
      main: '#7C4DFF',
      light: '#B388FF',
      dark: '#512DA8',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: ' "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: '10px 24px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          styleOverrides: {
            root: {
              boxshadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            },
          },
        },
      },
    }},
);

    // Root element
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <PayPalScriptProvider options={paypalOptions}>
              <HelmetProvider>
                <BrowserRouter>
                  <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <App/>
                    <Toaster
                      position="top-center"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#333',
                          color: '#fff',
                          borderRadius: '8px',
                        },
                        success: {
                          iconTheme: {
                            primary: '#4CAF50',
                            secondary: '#fff',
                          },
                        },
                        error: {
                          iconTheme: '#F44336',
                          secondary: '#fff',
                        },
                      }}
                      />
                  </ThemeProvider>
                </BrowserRouter>
              </HelmetProvider>
            </PayPalScriptProvider>
          </QueryClientProvider>
        </Provider>
      </React.StrictMode>
    );

    // Performance monitoring
    if (process.env.NODE_ENV === 'production') {
      // Web Vitals
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
    

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
