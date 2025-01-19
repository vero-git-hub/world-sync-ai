import React from 'react';
import "../styles/components/home/Home.css";
import { Link } from "react-router-dom";
import ChatBot from './ChatBot';
import TriviaGame from "./game/TriviaGame.tsx";
import '../styles/components/home/Home.css';
import '../styles/components/home/dashboard/Dashboard.css';
import '../styles/components/home/Assistant.css';
import '../styles/components/home/Insights.css';

const Home: React.FC = () => {
    return (
        <div className="home-page">
            {/* First column */}
            <div className="column">
                <div className="widget assistant-widget wide-widget">
                    <div className="widget-content">
                        <img src="/images/globe.jpg" alt="Globe" className="globe-image"/>
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
                <div className="widget trivia-widget">
                    <TriviaGame/>
                </div>
            </div>

            {/* Second column */}
            <div className="column">
                <div className="widget ai-assistant-widget">
                    <h2 className="ai-title">Advanced AI Assistant</h2>
                    <div className="ai-options">
                        <button className="ai-btn">Exploration</button>
                        <button className="ai-btn">AI Features</button>
                    </div>
                </div>
                <div className="widget chat-widget">
                    <h2>MLB AI Chat</h2>
                    <ChatBot/>
                </div>
                <div className="widget analytics-widget">
                    <h2>Game Analysis</h2>
                    <p>Data-driven insights</p>
                </div>
            </div>

            {/* Third column */}
            <div className="column">
                {/* Username panel */}
                <div className="widget user-widget">
                    <div className="user-panel">
                        <span className="user-label">Name</span>
                        <span className="user-name">John Smith</span>
                    </div>
                </div>

                <div className="button-container">
                    <Link to="/teams">
                        <button className="action-button">View Teams</button>
                    </Link>
                    <Link to="/profile">
                        <button className="action-button">Profile</button>
                    </Link>
                </div>

                {/* Schedule */}
                <div className="widget schedule-widget">
                    <h2>Schedule</h2>
                    <div className="schedule-content">
                        <img src="/images/player.jpg" alt="Player" className="player-image"/>
                        <p>Next game: Detroit Tigers vs Los Angeles Dodgers</p>
                        <p>Time: 01:10 | Venue: Dodger Stadium</p>
                    </div>
                </div>

                {/* Featured */}
                <div className="widget favorites-widget">
                    <h2>Favorites</h2>
                    <div className="favorites-content">
                        <img src="/images/favorite-player.jpg" alt="Favorite Player" className="favorite-image"/>
                        <p>Favorite Team: Dodgers</p>
                        <p>Games this week: 3</p>
                    </div>
                </div>

                {/* Insights */}
                <div className="widget insights-widget">
                    <h2>INSIGHTS</h2>
                    <div className="circle-stats">
                        <div className="circle">
                            <p>33</p>
                            <span>Games</span>
                        </div>
                        <div className="circle">
                            <p>33</p>
                            <span>Win %</span>
                        </div>
                        <div className="circle">
                            <p>23</p>
                            <span>MLB Rank</span>
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="widget insights-widget">
                    <h2>Insights</h2>
                    <img src="/images/insights-graph.jpg" alt="Insights Graph" className="insights-image"/>
                </div>
            </div>
        </div>
    );
};

export default Home;