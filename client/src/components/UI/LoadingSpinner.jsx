import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
    const spinnerClass = `loading-spinner loading-spinner--${size} loading-spinner--${color}`;
    const spinnerStyle = {
        borderColor: color,
        borderTopColor: 'transparent',
    };
    return (
        <div className={spinnerClass} style={spinnerStyle}>
            <div className="loading-spinner__inner"></div>
        </div>
    );
}

export default LoadingSpinner;