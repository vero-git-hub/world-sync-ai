import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScheduleDate } from '../types/schedule.ts';
import FilterControls from './FilterControls';
import ScheduleGrid from './ScheduleGrid';
import PaginationControls from './PaginationControls';
import "../styles/Schedule.css";
import "../styles/Button.css";
import "../styles/Text.css";

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleDate[]>([]);
    const [filteredSchedule, setFilteredSchedule] = useState<ScheduleDate[]>([]);
    const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;

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
        const savedFavoriteTeams = JSON.parse(localStorage.getItem('favoriteTeams') || '[]');
        setFavoriteTeams(savedFavoriteTeams);
    }, []);

    useEffect(() => {
        if (favoriteTeams.length === 0) {
            setShowFavorites(false);
        }
        if (showFavorites && favoriteTeams.length > 0) {
            const filtered = schedule.map((item) => ({
                ...item,
                games: item.games.filter((game) =>
                    favoriteTeams.includes(game.teams.away.team.name) ||
                    favoriteTeams.includes(game.teams.home.team.name)
                ),
            })).filter((item) => item.games.length > 0);
            setFilteredSchedule(filtered);
        } else {
            setFilteredSchedule(schedule);
        }
    }, [schedule, showFavorites, favoriteTeams]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setCurrentPage(1);
        filterSchedule(date, selectedTeam);
    };

    const handleTeamChange = (team: string) => {
        setSelectedTeam(team);
        setCurrentPage(1);
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
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSchedule.slice(indexOfFirstItem, indexOfLastItem);

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
            <p>
                <span>{showFavorites ? "Shows favorite teams" : "Showing all teams"}</span>
                <button onClick={() => setShowFavorites(!showFavorites)}>
                    {showFavorites ? "Show all teams" : "Show favorite teams"}
                </button>
                <Link to="/profile">
                    <button>Change commands</button>
                </Link>
            </p>
            <FilterControls
                selectedDate={selectedDate}
                selectedTeam={selectedTeam}
                onDateChange={handleDateChange}
                onTeamChange={handleTeamChange}
                onResetFilter={handleResetFilter}
            />
            <ScheduleGrid filteredSchedule={currentItems}/>
            <PaginationControls
                currentPage={currentPage}
                totalItems={filteredSchedule.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Schedule;