import React from 'react';
import './Avatar.css';

const Avatar = ({
    src,
    alt,
    size = 'medium',
    fallback,
    online = false,
    className = '',
    onClick
}) => {
    const avatarClass = 
        `avatar avatar--${size} ${online ? 'avatar--online' : ''} ${className}`;

        const getInitials = (name) => {
            if (!name) return '?';
            return name
            .split(' ' )
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        };

        return (
            <div className={avatarClass} onClick={onClick}/>
                {src ? (
                    <img
                       src={src}
                       alt={alt || 'Avatar'}
                       className="avatar__image"
                       onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                       }}
                    />
                ) : (
                    <div className="avatar-fallback">
                        {fallback || getInitials(alt) || '?'}
                        </div>
                )}

                {src && (
                    <div className="avatar-fallback" style={{ display: 'none' }}>
                        {fallback || getInitials(alt) || '?'}
                )}

                {online && <div className="avatar-online-indicator">
            </div>
            
                }
            </div>

        );
}