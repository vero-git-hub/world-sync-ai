import React, { useEffect, useState } from 'react';
import "../styles/components/home/Home.css";
import { Link } from "react-router-dom";
import ChatBot from './ChatBot';
import TriviaGame from "./game/TriviaGame";
import { useSchedule } from "./schedule/ScheduleContext";
import API from "../api.ts";
import {Team, UserData} from "../types/home.ts";

const Home: React.FC = () => {
    const [showTrivia, setShowTrivia] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [randomTeam, setRandomTeam] = useState<Team | null>(null);
    const [loadingTeam, setLoadingTeam] = useState<boolean>(true);

    const { schedule, loading } = useSchedule();

    // Profile
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get<UserData>('/users/current');
                if (response.status === 200) {
                    setUserData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUserData();
    }, []);

    // Teams
    useEffect(() => {
        const fetchRandomTeam = async () => {
            try {
                const response = await API.get<{ teams: Team[] }>('/teams/mlb/teams');
                if (response.status === 200 && response.data.teams.length > 0) {
                    const teamsList = response.data.teams;
                    const randomIndex = Math.floor(Math.random() * teamsList.length);
                    const selectedTeam = teamsList[randomIndex];

                    const logoResponse = await API.get(`/teams/mlb/team/${selectedTeam.id}/logo`, {
                        responseType: 'blob'
                    });

                    const logoBlob = logoResponse.data as Blob;
                    const logoUrl = URL.createObjectURL(logoBlob);

                    setRandomTeam({ ...selectedTeam, logoUrl });
                } else {
                    console.warn("No teams found.");
                }
            } catch (error) {
                console.error("Failed to fetch teams", error);
            } finally {
                setLoadingTeam(false);
            }
        };

        fetchRandomTeam();
    }, []);

    return (
        <div className="home-page">
            <header className="home-header">
                <img src="/public/images/logo_50.png" alt="MLB Logo" className="mlb-logo"/>
                <h1>⚾ Welcome to World Sync AI ⚾</h1>
                <p>Your ultimate MLB companion</p>
            </header>

            {/* Top row */}
            <div className="top-row">
                <div className="widget schedule-widget">
                    <Link to="/schedule">
                        <h2>Schedule</h2>
                    </Link>
                    <div className="schedule-content">
                        {loading ? (
                            <p>Loading schedule...</p>
                        ) : schedule ? (
                            <>
                                <p>Next game: {schedule.teams}</p>
                                <p>Date: {schedule.date}</p>
                                <p>Time: {schedule.time} | Venue: {schedule.venue}</p>
                            </>
                        ) : (
                            <p>No upcoming games available</p>
                        )}
                        <Link to={`/schedule`} className="schedule-link">All games</Link>
                    </div>
                </div>
                <div className="widget teams-widget">
                    <Link to="/teams">
                        <h2>Teams</h2>
                    </Link>
                    <div className="teams-content">
                        {loadingTeam ? (
                            <p>Loading teams...</p>
                        ) : randomTeam ? (
                            <>
                                <img src={randomTeam.logoUrl} alt={randomTeam.name} className="teams-image" />
                                <p>Random Team: {randomTeam.name}</p>
                                <Link to={`/team/${randomTeam.id}`} className="team-link">About team</Link>
                                {/*<p>Games this week: 3</p>*/}
                            </>
                        ) : (
                            <p>No teams available</p>
                        )}
                    </div>

                </div>
                <div className="widget profile-widget">
                    <Link to="/profile">
                        <h2>Profile</h2>
                    </Link>
                    <div>
                        {userData?.username ? (
                            <span className="user-name">
                            <span className="label">👨 Name:</span> {userData.username}</span>
                                ) : (
                            <span className="user-name"><span className="label">👨 Name:</span> Not provided</span>
                                )}
                    </div>
                    <div>
                        {userData?.email ? (
                            <span className="user-email"><span className="label">📧 Email:</span> {userData.email}</span>
                        ) : (
                            <span className="user-email">
                            <span className="label">📧 Email:</span> Not provided</span>
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
                    </div>
                    <Link to={`/profile`} className="profile-link">More info</Link>
                </div>
            </div>

            {/* Bottom row */}
            <div className="bottom-row">
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
        </div>
    );
};

export default Home;