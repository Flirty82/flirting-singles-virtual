import React, { forwardRef, useState } from 'react';
import './Input.css';

const Input = forwardRef(({ label, type, value, onChange, error }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`input-container ${error ? 'error' : ''} ${isFocused ? 'focused' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="input-field"
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
