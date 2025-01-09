import React, { useEffect, useState } from 'react';
import { ScheduleDate } from '../types/schedule.ts';

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
        <div>
            <h1>MLB Schedule</h1>
            {schedule.map((scheduleDate, index) => (
                <div key={index}>
                    <h2>{scheduleDate.date}</h2>
                    <ul>
                        {scheduleDate.games.map((game, gameIndex) => (
                            <li key={gameIndex}>
                                {game.teams.away.team.name} vs {game.teams.home.team.name} at{' '}
                                {new Date(game.gameDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} (
                                {game.venue.name})
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Schedule;