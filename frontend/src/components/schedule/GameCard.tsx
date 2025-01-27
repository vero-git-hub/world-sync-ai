import React from 'react';
import { format } from 'date-fns';
import { FaCalendarPlus } from 'react-icons/fa6';
import "../../styles/components/schedule/GameCard.css";

interface GameCardProps {
    homeTeam: string;
    awayTeam: string;
    homeLogo: string;
    awayLogo: string;
    homeTeamId: number;
    awayTeamId: number;
    gameTime: string;
    venue: string;
    onTeamClick: (teamId: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({ homeTeam, awayTeam, homeLogo, awayLogo, homeTeamId, awayTeamId, gameTime, venue, onTeamClick }) => {
    const formattedDate = format(new Date(gameTime), 'MMMM d');
    const formattedTime = format(new Date(gameTime), 'HH:mm');

    const handleAddToCalendar = async () => {
        try {
            const userToken = localStorage.getItem("token");
            if (!userToken) {
                alert("❌ You are not logged in. Please log in first.");
                return;
            }

            const start = gameTime;
            const endDate = new Date(gameTime);
            endDate.setHours(endDate.getHours() + 1);
            const end = endDate.toISOString();

            const bodyData = {
                summary: `Match: ${awayTeam} at ${homeTeam}`,
                description: `Venue: ${venue}`,
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
            <div className="team-info" onClick={() => onTeamClick(awayTeamId)}>
                <img src={awayLogo} alt={`${awayTeam} logo`} className="team-logo"/>
                <span className="team-name">{awayTeam}</span>
            </div>
            <div className="game-details">
                <span className="game-date">{formattedDate}</span>
                <span className="game-time">{formattedTime}</span>
                <span className="venue">{venue}</span>
            </div>
            <div className="team-info" onClick={() => onTeamClick(homeTeamId)}>
                <img src={homeLogo} alt={`${homeTeam} logo`} className="team-logo"/>
                <span className="team-name">{homeTeam}</span>
            </div>

            <button
                style={{marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px'}}
                onClick={handleAddToCalendar}
                title="Add game to Google Calendar"
            >
                <FaCalendarPlus size={16}/>
            </button>
        </div>
    );
};

export default GameCard;