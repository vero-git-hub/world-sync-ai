import React from 'react';
import "../styles/components/Home.css";
import { Link } from "react-router-dom";
import ChatBot from './ChatBot';

const Home: React.FC = () => {
    return (
        <div className="home-page">
            <div className="column">
                <div className="widget assistant-widget wide-widget">
                    <h2>Advanced AI Assistant</h2>
                    <div className="widget-content">
                        <img src="/globe.jpg" alt="Globe" className="globe-image"/>
                    </div>
                </div>

                <div className="stats-container">
                    <div className="stat-widget">
                        <p>202</p>
                        <span>Games Played</span>
                    </div>
                    <div className="stat-widget">
                        <p>2.8</p>
                        <span>ERA Average</span>
                    </div>
                    <div className="stat-widget">
                        <p>2.6</p>
                        <span>Win Rate</span>
                    </div>
                </div>

                <div className="widget home-widget">
                    <h2>Home</h2>
                    <div className="home-buttons">
                        <Link to="/"><img src="/images/home-icon.png" alt="Home"/></Link>
                        <Link to="/favorites"><img src="/images/favorite-icon.png" alt="Favorites"/></Link>
                        <Link to="/stats"><img src="/images/stats-icon.png" alt="Stats"/></Link>
                    </div>
                </div>
            </div>

            <div className="column">
                <div className="widget schedule-widget">
                    <h2>Schedule</h2>
                    <Link to="/schedule">To schedule</Link>
                    <p>Next game: Detroit Tigers vs Los Angeles Dodgers</p>
                    <p>Time: 01:10 | Venue: Dodger Stadium</p>
                </div>

                <div className="widget favorites-widget">
                    <h2>Favorites</h2>
                    <p>Favorite Team: Mets</p>
                    <p>Games this week: 3</p>
                </div>

                <div className="widget chat-widget">
                    <h2>MLB AI Chat</h2>
                    <ChatBot />
                </div>
            </div>

            <div className="column">
                <div className="button-container">
                    <Link to="/teams">
                        <button className="action-button">View Teams</button>
                    </Link>
                    <Link to="/profile">
                        <button className="action-button">Profile</button>
                    </Link>
                </div>

                <div className="widget stats-widget">
                    <h2>MLB Stats</h2>
                    <p>Top Player Stats</p>
                </div>

                <div className="widget analytics-widget">
                    <h2>Game Analysis</h2>
                    <p>Data-driven insights</p>
                </div>

                <div className="widget leaderboard-widget">
                    <h2>Leaderboard</h2>
                    <p>Current Standings</p>
                </div>

                <div className="widget news-widget">
                    <h2>Latest News</h2>
                    <p>MLB Headlines</p>
                </div>
            </div>
        </div>
    );
};

export default Home;