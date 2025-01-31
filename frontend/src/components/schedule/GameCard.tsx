import React from 'react';
import { format } from 'date-fns';
import { FaCalendarPlus } from 'react-icons/fa6';
import "../../styles/components/schedule/GameCard.css";
import { GameCardProps } from "../../types/card.ts";

const GameCard: React.FC<GameCardProps> = ({
                                               homeTeam,
                                               awayTeam,
                                               homeLogo,
                                               awayLogo,
                                               homeTeamId,
                                               awayTeamId,
                                               gameTime,
                                               venue,
                                               onTeamClick
                                           }) => {
    const formattedDate = format(new Date(gameTime), 'MMMM d, yyyy');
    const formattedTime = format(new Date(gameTime), 'hh:mm a');

    const handleAddToCalendar = async () => {
        try {
            const userToken = localStorage.getItem("token");
            if (!userToken) {
                alert("❌ You are not logged in. Please log in first.");
                return;
            }

            const start = gameTime;
            const endDate = new Date(gameTime);
            endDate.setHours(endDate.getHours() + 3);
            const end = endDate.toISOString();

            const bodyData = {
                summary: `⚾ Match: ${awayTeam} at ${homeTeam}`,
                description: `📍 Venue: ${venue}`,
                startDateTime: start,
                endDateTime: end,
            };

            const response = await fetch("http://localhost:8080/api/google/calendar/event/game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error response:", text);

                if (response.status === 401) {
                    alert("❌ You are not authorized. Please log in to your Google account.");
                } else if (response.status === 403) {
                    alert("⚠️ Access denied. Make sure the application has the correct permissions.");
                } else if (response.status === 500) {
                    alert("🚨 Server error. Please try again later.");
                } else {
                    alert(`❗ Failed to create event: ${text}`);
                }
                return;
            }

            alert("✅ Event added to Google Calendar!");
        } catch (error) {
            console.error("❗ Error adding event to calendar:", error);
            alert("🌐 Error adding event to calendar. Please check your internet connection and try again.");
        }
    };

    return (
        <div className="game-card">
            <div className="team-section">
                <div className="team-info" onClick={() => onTeamClick(awayTeamId)}>
                    <img src={awayLogo} alt={`${awayTeam} logo`} className="team-logo"/>
                    <span className="team-name">{awayTeam}</span>
                </div>
                <span className="vs-text">VS</span>
                <div className="team-info" onClick={() => onTeamClick(homeTeamId)}>
                    <img src={homeLogo} alt={`${homeTeam} logo`} className="team-logo"/>
                    <span className="team-name">{homeTeam}</span>
                </div>
            </div>

            <div className="match-details">
                <table className="match-table">
                    <tbody>
                    <tr>
                        <td className="label">📅 Date:</td>
                        <td className="value">{formattedDate}</td>
                    </tr>
                    <tr>
                        <td className="label">🕒 Time:</td>
                        <td className="value">{formattedTime}</td>
                    </tr>
                    <tr>
                        <td className="label">📍 Venue:</td>
                        <td className="value">{venue}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <button className="widget-button" onClick={handleAddToCalendar} title="Add game to Google Calendar">
                <FaCalendarPlus size={18}/> Add to Calendar
            </button>
        </div>
    );
};

export default GameCard;