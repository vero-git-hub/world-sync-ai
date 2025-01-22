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

// API response interface with schedule
interface MlbScheduleResponse {
    dates: {
        date: string;
        games: {
            gamePk: number;
            gameDate: string;
            officialDate: string;
            teams: {
                away: { team: { name: string } };
                home: { team: { name: string } };
            };
            venue: { name: string };
        }[];
    }[];
}

interface GameSchedule {
    date: string;
    teams: string;
    time: string;
    venue: string;
}

const Home: React.FC = () => {
    const [showTrivia, setShowTrivia] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [schedule, setSchedule] = useState<GameSchedule | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get<MlbScheduleResponse>("/api/schedule/mlb");

                if (response.status === 200 && response.data.dates.length > 0) {
                    const now = new Date();

                    const futureGames = response.data.dates.flatMap(date =>
                        date.games.filter(game => new Date(game.gameDate) > now)
                    );

                    if (futureGames.length > 0) {
                        const nextGame = futureGames[0];

                        setSchedule({
                            date: nextGame.officialDate || "Unknown Date",
                            teams: `${nextGame.teams.away.team.name} vs ${nextGame.teams.home.team.name}`,
                            time: new Date(nextGame.gameDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            venue: nextGame.venue.name,
                        });
                    } else {
                        console.warn("No future games found.");
                    }
                } else {
                    console.warn("No schedule data available.");
                }
            } catch (error) {
                console.error("Failed to fetch schedule", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
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