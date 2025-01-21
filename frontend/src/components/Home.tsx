import React, { useState } from 'react';
import "../styles/components/home/Home.css";
import { Link } from "react-router-dom";
import ChatBot from './ChatBot';
import TriviaGame from "./game/TriviaGame.tsx";
import '../styles/components/home/Home.css';
import '../styles/components/home/dashboard/Dashboard.css';
import '../styles/components/home/Assistant.css';
import '../styles/components/home/Insights.css';

const Home: React.FC = () => {
    const [showTrivia, setShowTrivia] = useState(false);

    return (
        <div className="home-page">
            <div className="column">
                <div className="widget assistant-widget wide-widget">
                    <div className="widget-content">
                        <h2 className="ai-title">Advanced AI Assistant</h2>
                        <img src="/images/globe.jpg" alt="Globe" className="globe-image"/>
                    </div>
                </div>

                <div className="widget trivia-intro-widget">
                    <h2>MLB Trivia ⚾</h2>
                    {showTrivia ? (
                        <div className="widget trivia-widget">
                            <TriviaGame />
                        </div>
                    ) : (
                        <>
                            <p>Step up to the plate and prove your skills...</p>
                            <button
                                className="play-trivia-btn"
                                onClick={() => setShowTrivia(true)}
                            >
                                Let's Play Trivia!
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="column">
                <div className="widget chat-widget">
                    <h2>MLB AI Chat</h2>
                    <ChatBot/>
                </div>
            </div>

            <div className="column">
                <div className="widget favorites-widget">
                    <div className="widget user-widget">
                        <div className="user-panel">
                            <span className="user-name">John Smith</span>
                            <Link to="/profile">
                                Profile
                            </Link>
                        </div>

                    </div>
                    <h2>Favorites</h2>
                    <div className="favorites-content">
                        <img src="/images/favorite-player.jpg" alt="Favorite Player" className="favorite-image"/>
                        <p>Favorite Team: Dodgers</p>
                        <p>Games this week: 3</p>
                    </div>
                </div>

                <div className="widget schedule-widget">
                    <Link to="/schedule">
                        <h2>Schedule</h2>
                    </Link>
                    <div className="schedule-content">
                        <img src="/images/schedule.jpg" alt="Schedule" className="schedule-image"/>
                        <p>Next game: Detroit Tigers vs Los Angeles Dodgers</p>
                        <p>Time: 01:10 | Venue: Dodger Stadium</p>
                    </div>
                </div>

                <div className="widget teams-widget">
                    <Link to="/teams">
                        <h2>Teams</h2>
                    </Link>
                    <div className="teams-content">
                        <img src="/images/teams.jpg" alt="Teams Player" className="teams-image"/>
                        <p>Random Team: Dodgers</p>
                        <p>Games this week: 3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;