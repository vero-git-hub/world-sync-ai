import React, { useEffect, useState } from 'react';

interface Game {
    homeTeam: string;
    awayTeam: string;
    time: string;
}

interface ScheduleDate {
    date: string;
    games: Game[];
}

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleDate[]>([]);

    useEffect(() => {
        fetch('/api/schedule/local')
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
                                {game.homeTeam} vs {game.awayTeam} at {game.time}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Schedule;