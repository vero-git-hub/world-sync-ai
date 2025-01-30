import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FavoriteTeam, ScheduleDate} from '../../types/schedule.ts';
import FilterControls from '../FilterControls.tsx';
import ScheduleGrid from './ScheduleGrid.tsx';
import PaginationControls from '../PaginationControls.tsx';
import SelectedTeams from "./SelectedTeams.tsx";
import {useAuth} from "../auth/AuthContext.tsx";
import API from "../../api.ts";
import "../../styles/components/schedule/Schedule.css";

interface UserResponse {
    id: string;
}

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
    const navigate = useNavigate();
    const { token } = useAuth();

    const fetchSchedule = async () => {
        if (!token) {
            console.warn("⚠️ No token, skipping schedule fetch.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const cachedData = sessionStorage.getItem("mlbSchedule");
            const cachedTimestamp = sessionStorage.getItem("mlbScheduleTimestamp");

            const now = Date.now();
            const cacheValid = cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < 10 * 60 * 1000;

            if (cacheValid) {
                console.log("✅ Using cached MLB schedule data");
                const data = JSON.parse(cachedData);
                setSchedule(data.dates || []);
                setFilteredSchedule(data.dates || []);
            } else {
                console.log("🔄 Fetching new MLB schedule data...");
                const response = await API.get<{ dates: ScheduleDate[] }>('/schedule/mlb');

                setSchedule(response.data.dates || []);
                setFilteredSchedule(response.data.dates || []);

                sessionStorage.setItem("mlbSchedule", JSON.stringify(response.data));
                sessionStorage.setItem("mlbScheduleTimestamp", now.toString());
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavoriteTeams = async () => {
        if (!token) {
            console.warn("⚠️ No token, skipping favorite teams fetch.");
            return;
        }

        try {
            const userResponse = await API.get<UserResponse>('/users/current');
            const userId = userResponse.data.id;

            const response = await API.get<FavoriteTeam[]>(`/favorite-teams/user/${userId}`);

            if (response.status === 204) {
                setFavoriteTeams([]);
                return;
            }

            setFavoriteTeams(response.data.map((team: { teamName: string }) => team.teamName));
        } catch (err) {
            console.error("Error fetching favorite teams:", err);
            setError((err as Error).message);
        }
    };

    const handleTeamClick = (teamId: number) => {
        navigate(`/team/${teamId}`);
    };

    useEffect(() => {
        fetchSchedule();
    }, [token]);

    useEffect(() => {
        if (showFavorites) {
            fetchFavoriteTeams();
        }
    }, [showFavorites, token]);

    useEffect(() => {
        if (showFavorites && favoriteTeams.length > 0) {
            const filtered = schedule.map((item) => ({
                ...item,
                games: item.games.filter((game) => {
                    return favoriteTeams.some((team) =>
                        game.teams.away.team.name.includes(team) ||
                        game.teams.home.team.name.includes(team)
                    );
                }),
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
            <h1>MLB Schedule 2025</h1>
            <p>
                {favoriteTeams.length === 0 ? (
                    "Showing all teams (no favorites set)"
                ) : (
                    showFavorites ? "Showing favorite teams" : "Showing all teams"
                )}

                {favoriteTeams.length !== 0 && (
                    <button onClick={() => setShowFavorites(!showFavorites)}>
                        {showFavorites ? "Show all teams" : "Show favorite teams"}
                    </button>
                )}

                <Link to="/profile">
                    <button>Change favorite teams</button>
                </Link>
            </p>

            <SelectedTeams favoriteTeams={favoriteTeams}/>

            <FilterControls
                selectedDate={selectedDate}
                selectedTeam={selectedTeam}
                onDateChange={handleDateChange}
                onTeamChange={handleTeamChange}
                onResetFilter={handleResetFilter}
            />
            <ScheduleGrid filteredSchedule={currentItems} onTeamClick={handleTeamClick}/>
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