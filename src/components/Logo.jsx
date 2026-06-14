import React from 'react';
import logoImage from '../assets/logo.png';

const Logo = () => {

    return (
        <div style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: '0'
        }}>
            <img
                src={logoImage}
                alt="Rubik Logo"
                style={{ width: '400px', height: 'auto' }}
            />
        </div>
    );
};

export default Logo;