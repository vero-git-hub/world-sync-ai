import React, { useEffect, useState } from 'react';
import { ScheduleDate } from '../types/schedule.ts';
import { Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';
import "../styles/Schedule.css";

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleDate[]>([]);
    const [filteredSchedule, setFilteredSchedule] = useState<ScheduleDate[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<string>('');

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
            setFilteredSchedule(data.dates || []);
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

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);

        if (selectedDate) {
            const filtered = schedule.filter((item) => item.date === selectedDate);
            setFilteredSchedule(filtered);
        } else {
            setFilteredSchedule(schedule);
        }
    };

    const handleResetFilter = () => {
        setSelectedDate('');
        setFilteredSchedule(schedule);
    };

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <TextField
                    label="Filter by Date"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleResetFilter}
                    disabled={selectedDate.length === 0}
                >
                    Reset Filter
                </Button>
            </Box>
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
        </div>
    );
};

export default Schedule;