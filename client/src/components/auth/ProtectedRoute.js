// frontend/src/components/auth/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireCompleteProfile = false,
  requireVerification = false,
  requirePremium = false,
  allowedMembershipTypes = [],
  redirectTo = '/login',
  showUpgradePrompt = true
}) => {
  const { user, isAuthenticated, loading, isPremium, hasMembership } = useAuth();
  const location = useLocation();
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  // Show upgrade prompts for premium features
  useEffect(() => {
    if (user && requirePremium && !isPremium() && !hasShownPrompt && showUpgradePrompt) {
      setHasShownPrompt(true);
      toast.error(
        'This feature requires a premium membership. Upgrade now to unlock it!',
        {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => window.location.href = '/membership'
          }
        }
      );
    }
  }, [user, requirePremium, isPremium, hasShownPrompt, showUpgradePrompt]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <LoadingSpinner size="large" />
        <p>Verifying your access...</p>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    toast.error('Please sign in to access this page');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If user is authenticated, perform additional checks
  if (isAuthenticated && user) {
    
    // Check if account is active
    if (!user.isActive) {
      toast.error('Your account has been deactivated. Please contact support.');
      return (
        <Navigate 
          to="/account-deactivated" 
          replace 
        />
      );
    }

    // Check if email verification is required
    if (requireVerification && !user.isVerified) {
      toast.error('Please verify your email address to access this feature');
      return (
        <Navigate 
          to="/verify-email" 
          state={{ from: location }}
          replace 
        />
      );
    }

    // Check if profile completion is required
    if (requireCompleteProfile && !user.profileCompleted) {
      toast.info('Please complete your profile setup first');
      return (
        <Navigate 
          to="/profile/setup" 
          state={{ from: location }}
          replace 
        />
      );
    }

    // Check membership requirements
    if (allowedMembershipTypes.length > 0 && !hasMembership(allowedMembershipTypes)) {
      const membershipList = allowedMembershipTypes.join(', ');
      toast.error(`This feature requires ${membershipList} membership`);
      return (
        <Navigate 
          to="/membership" 
          state={{ 
            from: location,
            requiredMembership: allowedMembershipTypes 
          }}
          replace 
        />
      );
    }

    // Check premium requirement
    if (requirePremium && !isPremium()) {
      toast.error('This feature requires a premium membership');
      return (
        <Navigate 
          to="/membership" 
          state={{ 
            from: location,
            premiumRequired: true 
          }}
          replace 
        />
      );
    }

    // Check if membership has expired for premium features
    if (user.membershipType !== 'free' && user.membershipExpiry) {
      const now = new Date();
      const expiry = new Date(user.membershipExpiry);
      
      if (now > expiry && (requirePremium || allowedMembershipTypes.length > 0)) {
        toast.error('Your premium membership has expired. Please renew to continue using premium features.');
        return (
          <Navigate 
            to="/membership" 
            state={{ 
              from: location,
              membershipExpired: true 
            }}
            replace 
          />
        );
      }
    }
  }

  // If all checks pass, render the children
  return (
    <div className="protected-route-content">
      {children}
    </div>
  );
};

// Higher-order component for easier usage
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific route protection components for common use cases
export const RequireAuth = ({ children }) => (
  <ProtectedRoute requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export const RequireCompleteProfile = ({ children }) => (
  <ProtectedRoute requireAuth={true} requireCompleteProfile={true}>
    {children}
  </ProtectedRoute>
);

export const RequireVerification = ({ children }) => (
  <ProtectedRoute requireAuth={true} requireVerification={true}>
    {children}
  </ProtectedRoute>
);

export const RequirePremium = ({ children, showUpgradePrompt = true }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requirePremium={true}
    showUpgradePrompt={showUpgradePrompt}
  >
    {children}
  </ProtectedRoute>
);

export const RequireMembership = ({ children, membershipTypes }) => (
  <ProtectedRoute 
    requireAuth={true} 
    allowedMembershipTypes={membershipTypes}
  >
    {children}
  </ProtectedRoute>
);

// Component for checking multiple requirements
export const RequireAll = ({ children, requirements = {} }) => {
  const {
    auth = true,
    completeProfile = false,
    verification = false,
    premium = false,
    membershipTypes = []
  } = requirements;

  return (
    <ProtectedRoute
      requireAuth={auth}
      requireCompleteProfile={completeProfile}
      requireVerification={verification}
      requirePremium={premium}
      allowedMembershipTypes={membershipTypes}
    >
      {children}
    </ProtectedRoute>
  );
};

// Role-based access control (future enhancement)
export const RequireRole = ({ children, roles = [], operator = 'OR' }) => {
  const { user } = useAuth();
  
  if (!user || !user.roles) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasRequiredRole = operator === 'OR' 
    ? roles.some(role => user.roles.includes(role))
    : roles.every(role => user.roles.includes(role));

  if (!hasRequiredRole) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  );
};

// Admin only routes
export const AdminOnly = ({ children }) => (
  <RequireRole roles={['admin']} >
    {children}
  </RequireRole>
);

// Moderator routes
export const ModeratorOnly = ({ children }) => (
  <RequireRole roles={['admin', 'moderator']} operator="OR">
    {children}
  </RequireRole>
);

export default ProtectedRoute;