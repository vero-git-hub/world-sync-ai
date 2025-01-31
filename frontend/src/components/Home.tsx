import React, { useEffect, useState } from 'react';
import "../styles/components/home/Home.css";
import "../styles/components/home/chat.css";
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
                <div>
                    <h1>⚾ Welcome to World Sync AI ⚾ Your ultimate MLB companion!</h1>
                    <p>Find out upcoming games, view team lineups. Add games to Google Calendar, chat with Gemini, and play trivia games.</p>
                </div>
            </header>

            {/* Top row */}
            <div className="top-row">
                <div className="widget schedule-widget">
                    <Link to="/schedule">
                        <h2>Next game</h2>
                    </Link>
                    <div className="schedule-content">
                        {loading ? (
                            <p>Loading schedule...</p>
                        ) : schedule ? (
                            <>
                                <p className="team-name-home">{schedule.teams.away}</p>
                                <p>
                                    <span className="vs-text">vs</span>
                                    <span className="team-name-home">{schedule.teams.home}</span>
                                </p>

                                <table className="info-table">
                                    <tbody>
                                        <tr>
                                            <td className="label">📅 Date:</td>
                                            <td>{schedule.date}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">⏰ Time:</td>
                                            <td>{schedule.time}, {schedule.dayNight === "night" ? "Night Game" : "Day Game"}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">🏟️ Venue:</td>
                                            <td>{schedule.venue}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">🌍 Location:</td>
                                            <td>{schedule.description}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">📖 Series:</td>
                                            <td>{schedule.seriesInfo}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p>No upcoming games available</p>
                        )}
                        <Link to={`/schedule`} className="widget-button">All games</Link>
                    </div>
                </div>

                <div className="widget teams-widget">
                    <Link to="/teams">
                        <h2>Random Team</h2>
                    </Link>
                    <div className="teams-content">
                        {loadingTeam ? (
                            <p>Loading teams...</p>
                        ) : randomTeam ? (
                            <>
                                <div className="team-info-container">
                                    <table className="info-table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p>{randomTeam.name}</p>
                                                    <p>{randomTeam.locationName}</p>
                                                </td>
                                                <td>
                                                    <img src={randomTeam.logoUrl} alt={randomTeam.name} className="teams-image" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="label">📅 Founded:</td>
                                                <td>{randomTeam.firstYearOfPlay}</td>
                                            </tr>
                                            <tr>
                                                <td className="label">🏆 League:</td>
                                                <td>{randomTeam.league.name}</td>
                                            </tr>
                                            <tr>
                                                <td className="label">📂 Division:</td>
                                                <td>{randomTeam.division.name}</td>
                                            </tr>
                                            <tr>
                                                <td className="label">⚾ Spring League:</td>
                                                <td>{randomTeam.springLeague.name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <Link to={`/team/${randomTeam.id}`} className="widget-button">About Team</Link>
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

                    <table className="profile-table">
                        <tbody>
                        <tr>
                            <td className="label">👨 Name:</td>
                            <td>{userData?.username ? userData.username : "Not provided"}</td>
                        </tr>
                        <tr>
                            <td className="label">📧 Email:</td>
                            <td>{userData?.email ? userData.email : "Not provided"}</td>
                        </tr>
                        </tbody>
                    </table>

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
                    <Link to={`/profile`} className="widget-button">More info</Link>
                </div>
            </div>

            {/* Bottom row */}
            <div className="bottom-row">
                <div className="bottom-widget chat-widget">
                    <h2>MLB AI Chat</h2>
                    <ChatBot />
                </div>
                <div className="bottom-widget trivia-intro-widget">
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
        </div>
    );
};

export default Home;