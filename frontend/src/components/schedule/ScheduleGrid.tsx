import React, { useEffect, useState } from 'react';
import GameCard from './GameCard';
import "../../styles/components/schedule/ScheduleGrid.css";
import axios from 'axios';
import {DateItem, Game} from "../../types/schedule.ts";

const ScheduleGrid: React.FC<{ filteredSchedule: DateItem[], onTeamClick: (teamId: number) => void }> = ({ filteredSchedule, onTeamClick }) => {
    const [logos, setLogos] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchLogos = async () => {
            const teamIds = new Set<number>();
            filteredSchedule.forEach(dateItem =>
                dateItem.games.forEach((game: Game) => {
                    teamIds.add(game.teams.home.team.id);
                    teamIds.add(game.teams.away.team.id);
                })
            );

            try {
                const logoPromises = Array.from(teamIds).map(async (teamId: number) => {
                    const response = await axios.get<Blob>(`/api/teams/mlb/team/${teamId}/logo`, { responseType: 'blob' });
                    const logoUrl = URL.createObjectURL(response.data);
                    return { [teamId]: logoUrl };
                });

                const logosArray = await Promise.all(logoPromises);
                const logoMap = Object.assign({}, ...logosArray);

                setLogos(logoMap);
            } catch (error) {
                console.error("Error fetching logos:", error);
            }
        };

        fetchLogos();
    }, [filteredSchedule]);

    return (
        <div className="schedule-grid">
            {filteredSchedule.map((dateItem) =>
                dateItem.games.map((game: Game, index: number) => (
                    <GameCard
                        key={index}
                        homeTeam={game.teams.home.team.name}
                        awayTeam={game.teams.away.team.name}
                        homeLogo={logos[game.teams.home.team.id] || '/default-logo.png'}
                        awayLogo={logos[game.teams.away.team.id] || '/default-logo.png'}
                        homeTeamId={game.teams.home.team.id}
                        awayTeamId={game.teams.away.team.id}
                        gameTime={game.gameDate}
                        venue={game.venue.name}
                        onTeamClick={onTeamClick}
                    />
                ))
            )}
        </div>
    );
};

export default ScheduleGrid;