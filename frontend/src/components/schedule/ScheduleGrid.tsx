import React from 'react';
import { ScheduleDate } from '../../types/schedule.ts';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface ScheduleGridProps {
    filteredSchedule: ScheduleDate[];
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ filteredSchedule }) => {
    return (
        <>
            {filteredSchedule.map((scheduleDate, index) => (
                <div key={index}>
                    <h2>{scheduleDate.date}</h2>
                    <Box className="grid-container" sx={{ marginTop: 2 }}>
                        {scheduleDate.games.map((game, gameIndex) => (
                            <Card key={gameIndex} className="game-card">
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {game.teams.away.team.name} vs {game.teams.home.team.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Time: {new Date(game.gameDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Venue: {game.venue.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </div>
            ))}
        </>
    );
};

export default ScheduleGrid;