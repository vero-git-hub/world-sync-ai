import React, { useState } from 'react';
import "../styles/components/Header.css";

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <div className="logo">
                <h1>World Sync AI</h1>
            </div>
            <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="#">Dashboard</a></li>
                    <li><a href="#">Settings</a></li>
                    <li><a href="#">Profile</a></li>
                </ul>
            </nav>
            <div className="user-icon">
                <span>🔵</span>
            </div>
            <div className="burger-menu" onClick={toggleMenu}>
                <span className={menuOpen ? 'line open' : 'line'}></span>
                <span className={menuOpen ? 'line open' : 'line'}></span>
                <span className={menuOpen ? 'line open' : 'line'}></span>
            </div>
        </header>
    );
};

export default Header;