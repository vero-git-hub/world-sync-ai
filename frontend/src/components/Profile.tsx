import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Team} from "../types/schedule.ts";

const Profile: React.FC = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
    const [initialFavoriteTeams, setInitialFavoriteTeams] = useState<string[]>([]);
    const userId = 1;

    useEffect(() => {
        let isMounted = true;

        const fetchTeams = async () => {
            try {
                const [teamsResponse, favoriteTeamsResponse] = await Promise.all([
                    fetch('/api/schedule/mlb/teams'),
                    fetch(`/api/favorite-teams/user/${userId}`),
                ]);

                if (!teamsResponse.ok) {
                    throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
                }

                let favoriteTeamsData = [];
                if (favoriteTeamsResponse.status !== 204) {
                    favoriteTeamsData = await favoriteTeamsResponse.json();
                } else {
                    if (isMounted) {
                        console.log('Favorite teams response is empty (204 No Content).');
                    }
                }

                const teamsData = await teamsResponse.json();

                if (isMounted) {
                    setTeams(teamsData?.teams?.map((team: Team) => team.teamName) || []);
                    setFavoriteTeams(
                        Array.isArray(favoriteTeamsData)
                            ? favoriteTeamsData.map((team) => team.teamName)
                            : []
                    );
                    setInitialFavoriteTeams(
                        Array.isArray(favoriteTeamsData)
                            ? favoriteTeamsData.map((team) => team.teamName)
                            : []
                    );
                }
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Failed to load data. Please try again later.');
            }
        };

        fetchTeams();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    const handleTeamToggle = (team: string) => {
        setFavoriteTeams((prev) =>
            prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
        );
    };

    const saveFavoriteTeams = () => {
        const teamsToAdd = favoriteTeams.filter((team) => !initialFavoriteTeams.includes(team));
        const teamsToRemove = initialFavoriteTeams.filter((team) => !favoriteTeams.includes(team));

        const updateTeams = async (action: string, teamNames: string[]) => {
            try {
                const response = await fetch(`/api/favorite-teams/user/${userId}/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action, teamNames }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to ${action} favorite teams.`);
                }
            } catch (error) {
                console.error(`Error ${action}ing favorite teams:`, error);
            }
        };

        if (teamsToAdd.length > 0) {
            updateTeams('add', teamsToAdd);
        }

        if (teamsToRemove.length > 0) {
            updateTeams('remove', teamsToRemove);
        }

        alert('Changes saved!');
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <Link to="/">
                <button>Back to schedule</button>
            </Link>
            <ul>
                {teams.map((team) => (
                    <li key={team}>
                        <label>
                            <input
                                type="checkbox"
                                checked={favoriteTeams.includes(team)}
                                onChange={() => handleTeamToggle(team)}
                            />
                            {team}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={saveFavoriteTeams}>Save</button>
        </div>
    );
};

export default Profile;