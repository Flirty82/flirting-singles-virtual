// frontend/src/components/common/LoadingSpinner.js
import React from 'react';
import { FiHeart } from 'react-icons/fi';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  overlay = false,
  fullScreen = false,
  className = '' 
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return '1.5rem';
      case 'large':
        return '4rem';
      case 'xlarge':
        return '6rem';
      default:
        return '2.5rem';
    }
  };

  const getSpinnerClass = () => {
    let classes = `loading-spinner ${size} ${color}`;
    if (overlay) classes += ' overlay';
    if (fullScreen) classes += ' full-screen';
    if (className) classes += ` ${className}`;
    return classes;
  };

  const SpinnerContent = () => (
    <div className="spinner-content">
      <div className="spinner-container">
        {color === 'heart' ? (
          <div className="heart-spinner">
            <FiHeart className="heart-icon" />
          </div>
        ) : (
          <div className="spinner-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={getSpinnerClass()}>
        <div className="spinner-backdrop">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className={getSpinnerClass()}>
        <SpinnerContent />
      </div>
    );
  }

  return (
    <div 
      className={getSpinnerClass()}
      style={{ fontSize: getSpinnerSize() }}
    >
      <SpinnerContent />
    </div>
  );
};

// Specialized loading components
export const ButtonSpinner = ({ size = 'small', color = 'white' }) => (
  <div className="button-spinner">
    <div className={`spinner-ring ${size} ${color}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export const PageLoader = ({ text = 'Loading...' }) => (
  <LoadingSpinner 
    size="large" 
    color="primary" 
    text={text} 
    fullScreen={true} 
  />
);

export const HeartLoader = ({ text = 'Finding your perfect match...' }) => (
  <LoadingSpinner 
    size="large" 
    color="heart" 
    text={text} 
    overlay={true} 
  />
);

export const InlineSpinner = ({ size = 'small', text = '' }) => (
  <LoadingSpinner 
    size={size} 
    color="primary" 
    text={text} 
    className="inline" 
  />
);

// Loading skeleton components
export const ProfileSkeleton = () => (
  <div className="profile-skeleton">
    <div className="skeleton-avatar"></div>
    <div className="skeleton-content">
      <div className="skeleton-line long"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-line short"></div>
    </div>
  </div>
);

export const PostSkeleton = () => (
  <div className="post-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-avatar small"></div>
      <div className="skeleton-content">
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
    <div className="skeleton-post-content">
      <div className="skeleton-line long"></div>
      <div className="skeleton-line long"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-image"></div>
    </div>
  </div>
);

export const MessageSkeleton = () => (
  <div className="message-skeleton">
    {[1, 2, 3].map((_, index) => (
      <div key={index} className={`skeleton-message ${index % 2 === 0 ? 'sent' : 'received'}`}>
        <div className="skeleton-bubble"></div>
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ count = 3 }) => (
  <div className="cards-skeleton">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="card-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-line long"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner;