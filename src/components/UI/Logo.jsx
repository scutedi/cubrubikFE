import React from 'react';
import logoImage from '../../assets/logo.png';

const Logo = () => {

    return (
        <div style={{
            position: 'absolute',
            top: '-80px',           // Îl lipește de marginea de sus
            left: '50%',          // Îl duce la jumătatea ecranului
            transform: 'translateX(-50%)', // Îl centrează perfect pe orizontală
            zIndex: 1000,         // Se asigură că stă deasupra altor elemente
            padding: '0'
        }}>
            <img
                src={logoImage}
                alt="Rubik Logo"
                style={{ width: '400px', height: 'auto' }} // L-am făcut puțin mai mic (200px) pentru a nu ocupa tot ecranul sus
            />
        </div>
    );
};

export default Logo;