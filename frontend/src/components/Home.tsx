import React, { useState } from 'react';
import "../styles/components/home/Home.css";
import { Link } from "react-router-dom";
import ChatBot from './ChatBot';
import TriviaGame from "./game/TriviaGame.tsx";

const Home: React.FC = () => {
    const [showTrivia, setShowTrivia] = useState(false);

    return (
        <div className="home-page">
            {/* Top row: Trivia и AI Chat */}
            <div className="top-row">
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

                <div className="widget chat-widget">
                    <h2>MLB AI Chat</h2>
                    <ChatBot />
                </div>
            </div>

            {/* Bottom row: Favorites, Schedule, Teams */}
            <div className="bottom-row">
                <div className="widget favorites-widget">
                    <div className="user-panel">
                        <span className="user-name">John Smith</span>
                        <Link to="/profile">Profile</Link>
                    </div>
                    <h2>Favorites</h2>
                    <div className="favorites-content">
                        <img src="/images/favorite-player.jpg" alt="Favorite Player" className="favorite-image" />
                        <p>Favorite Team: Dodgers</p>
                        <p>Games this week: 3</p>
                    </div>
                </div>

                <div className="widget schedule-widget">
                    <Link to="/schedule">
                        <h2>Schedule</h2>
                    </Link>
                    <div className="schedule-content">
                        <img src="/images/schedule.jpg" alt="Schedule" className="schedule-image" />
                        <p>Next game: Detroit Tigers vs Los Angeles Dodgers</p>
                        <p>Time: 01:10 | Venue: Dodger Stadium</p>
                    </div>
                </div>

                <div className="widget teams-widget">
                    <Link to="/teams">
                        <h2>Teams</h2>
                    </Link>
                    <div className="teams-content">
                        <img src="/images/teams.jpg" alt="Teams Player" className="teams-image" />
                        <p>Random Team: Dodgers</p>
                        <p>Games this week: 3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;