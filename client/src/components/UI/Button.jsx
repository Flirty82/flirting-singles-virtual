import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`custom-button ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

return (
    <button
       type={type}
       className={buttonClass}
       disabled={disabled || loading}
       onClick={onClick}
       {...props}
    >
        {loading && <div className="btn-spinner"></div>}
        <span className={loading ? 'btn-content-laoding' : ''}>{children}</span>
    </button>
);

export default Button;