import React from 'react';
import "../styles/components/Header.css";

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo">
                <h1>World Sync AI</h1>
            </div>
            <nav className="navigation">
                <ul>
                    <li><a href="#">Dashboard</a></li>
                    <li><a href="#">Settings</a></li>
                    <li><a href="#">Profile</a></li>
                </ul>
            </nav>
            <div className="user-icon">
                <span>🔵</span>
            </div>
        </header>
    );
};

export default Header;