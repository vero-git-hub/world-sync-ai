import React, {useEffect, useState} from 'react';
import {ScheduleDate} from '../types/schedule.ts';

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleDate[]>([]);

    useEffect(() => {
        fetch('/api/schedule/mlb')
            .then((response) => response.json())
            .then((data) => setSchedule(data.dates || []))
            .catch((error) => console.error('Error fetching schedule:', error));
    }, []);

    return (
        <div>
            <h1>MLB Schedule</h1>
            {schedule.map((scheduleDate, index) => (
                <div key={index}>
                    <h2>{scheduleDate.date}</h2>
                    <ul>
                        {scheduleDate.games.map((game, gameIndex) => (
                            <li key={gameIndex}>
                                {game.teams.away.team.name} vs {game.teams.home.team.name} at {new Date(game.gameDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })} ({game.venue.name})
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Schedule;