import React, { useEffect, useState } from 'react';
import { ScheduleDate } from '../types/schedule.ts';
import FilterControls from './FilterControls';
import ScheduleGrid from './ScheduleGrid';
import "../styles/Schedule.css";
import "../styles/Button.css";
import "../styles/Text.css";

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleDate[]>([]);
    const [filteredSchedule, setFilteredSchedule] = useState<ScheduleDate[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTeam, setSelectedTeam] = useState<string>('');

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

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        if (date) {
            const filtered = schedule.filter((item) => item.date === date);
            setFilteredSchedule(filtered);
        } else {
            setFilteredSchedule(schedule);
        }
    };

    const handleTeamChange = (team: string) => {
        setSelectedTeam(team);
        filterSchedule(selectedDate, team);
    };

    const filterSchedule = (date: string, team: string) => {
        let filtered = schedule;
        if (date) {
            filtered = filtered.filter((item) => item.date === date);
        }
        if (team) {
            filtered = filtered.map((item) => ({
                ...item,
                games: item.games.filter((game) =>
                    game.teams.away.team.name.includes(team) ||
                    game.teams.home.team.name.includes(team)
                ),
            })).filter((item) => item.games.length > 0);
        }
        setFilteredSchedule(filtered);
    };

    const handleResetFilter = () => {
        setSelectedDate('');
        setSelectedTeam('');
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
            <FilterControls
                selectedDate={selectedDate}
                selectedTeam={selectedTeam}
                onDateChange={handleDateChange}
                onTeamChange={handleTeamChange}
                onResetFilter={handleResetFilter}
            />
            <ScheduleGrid filteredSchedule={filteredSchedule}/>
        </div>
    );
};

export default Schedule;