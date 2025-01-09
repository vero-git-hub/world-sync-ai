import React, { useEffect, useState } from 'react';
import { ScheduleDate } from '../types/schedule.ts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import "../styles/Schedule.css";

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleDate[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSchedule = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/schedule/mlb');
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setSchedule(data.dates || []);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    if (loading) {
        return <p>Loading schedule...</p>;
    }

    if (error) {
        return (
            <div style={{ color: 'red' }}>
                <p>Error: {error}</p>
                <button onClick={fetchSchedule} style={{ marginTop: '10px' }}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="schedule-container">
            <h1>MLB Schedule</h1>
            {schedule.map((scheduleDate, index) => (
                <div key={index}>
                    <h2>{scheduleDate.date}</h2>
                    <Box
                        className="grid-container"
                        sx={{ marginTop: 2 }}
                    >
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
        </div>
    );
};

export default Schedule;