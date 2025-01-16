import React from 'react';
import { format } from 'date-fns';
import "../../styles/components/schedule/GameCard.css";

interface GameCardProps {
    homeTeam: string;
    awayTeam: string;
    homeLogo: string;
    awayLogo: string;
    gameTime: string;
    venue: string;
    onTeamClick: (teamId: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({ homeTeam, awayTeam, homeLogo, awayLogo, gameTime, venue, onTeamClick }) => {
    const formattedDate = format(new Date(gameTime), 'MMMM d');
    const formattedTime = format(new Date(gameTime), 'HH:mm');

    const handleAddToCalendar = async () => {
        try {
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

            const response = await fetch("/api/google/calendar/event/game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const text = await response.text();
                alert("Failed to create event: " + text);
                return;
            }

            alert("Event added to Google Calendar!");
        } catch (error) {
            console.error("Error adding event to calendar:", error);
            alert("Error adding event to calendar.");
        }
    };

    return (
        <div className="game-card">
            <div className="team-info" onClick={() => onTeamClick(133)}>
                <img src={awayLogo} alt={`${awayTeam} logo`} className="team-logo"/>
                <span className="team-name">{awayTeam}</span>
            </div>
            <div className="game-details">
                <span className="game-date">{formattedDate}</span>
                <span className="game-time">{formattedTime}</span>
                <span className="venue">{venue}</span>
            </div>
            <div className="team-info" onClick={() => onTeamClick(136)}>
                <img src={homeLogo} alt={`${homeTeam} logo`} className="team-logo"/>
                <span className="team-name">{homeTeam}</span>
            </div>

            <button style={{marginTop: '8px'}} onClick={handleAddToCalendar}>
                Add to Calendar
            </button>
        </div>
    );
};

export default GameCard;