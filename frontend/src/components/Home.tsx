import React, { useEffect, useState } from 'react';
import "../styles/components/home/Home.css";
import { Link } from "react-router-dom";
import ChatBot from './ChatBot';
import TriviaGame from "./game/TriviaGame";
import axios from 'axios';

interface Team {
    id: number;
    teamName: string;
    userId: number;
}

interface UserData {
    id: number;
    username: string;
    email: string;
    password: string;
    favoriteTeams: Team[];
    hasGoogleCalendarToken: boolean;
}

const Home: React.FC = () => {
    const [showTrivia, setShowTrivia] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get<UserData>('/api/users/current');
                if (response.status === 200) {
                    setUserData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUserData();
    }, []);

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

            {/* Bottom row: Profile, Schedule, Teams */}
            <div className="bottom-row">
                <div className="widget profile-widget">
                    <Link to="/profile">
                        <h2>Profile</h2>
                    </Link>
                    <div>
                        {userData?.username ? (
                            <span className="user-name">{userData.username}</span>
                        ) : (
                            <span className="user-name">Name not provided</span>
                        )}
                    </div>
                    <div>
                        {userData?.email ? (
                            <span className="user-email">{userData.email}</span>
                        ) : (
                            <span className="user-email">Email not provided</span>
                        )}
                    </div>

                    <div className="favorites-content">
                        <div>
                            {userData?.favoriteTeams && userData.favoriteTeams.length > 0 ? (
                                <>
                                    <p>Favorite Teams:</p>
                                    <ul>
                                        {userData.favoriteTeams.map((team) => (
                                            <li key={team.id}>{team.teamName}</li>
                                            ))}
                                    </ul>
                                </>
                            ) : (
                                <p>Favorite Teams: None</p>
                            )}
                        </div>
                        {/*<p>Games this week: {userData ? userData.gamesThisWeek : "Loading..."}</p>*/}
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