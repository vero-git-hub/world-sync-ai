import React from 'react';
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
    return (
        <div className="game-card">
            <div className="team-info" onClick={() => onTeamClick(133)}>
                <img src={awayLogo} alt={`${awayTeam} logo`} className="team-logo"/>
                <span className="team-name">{awayTeam}</span>
            </div>
            <div className="game-details">
                <span className="game-time">{gameTime}</span>
                <span className="venue">{venue}</span>
            </div>
            <div className="team-info" onClick={() => onTeamClick(136)}>
                <img src={homeLogo} alt={`${homeTeam} logo`} className="team-logo"/>
                <span className="team-name">{homeTeam}</span>
            </div>
        </div>
    );
};

export default GameCard;