import React from 'react';
import GameCard from './GameCard';
import "../../styles/components/schedule/ScheduleGrid.css";

const ScheduleGrid: React.FC<{ filteredSchedule: any[], onTeamClick: (teamId: number) => void }> = ({ filteredSchedule, onTeamClick }) => {
    return (
        <div className="schedule-grid">
            {filteredSchedule.map((dateItem) =>
                dateItem.games.map((game: any, index: number) => (
                    <GameCard
                        key={index}
                        homeTeam={game.teams.home.team.name}
                        awayTeam={game.teams.away.team.name}
                        homeLogo={`/logos/${game.teams.home.team.name}.png`}
                        awayLogo={`/logos/${game.teams.away.team.name}.png`}
                        gameTime={game.time}
                        venue={game.venue.name}
                        onTeamClick={onTeamClick}
                    />
                ))
            )}
        </div>
    );
};

export default ScheduleGrid;