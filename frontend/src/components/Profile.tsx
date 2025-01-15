import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Team } from "../types/schedule.ts";
import "../styles/components/Profile.css";

interface SelectOption {
    value: string;
    label: string;
}

const Profile: React.FC = () => {
    const [teams, setTeams] = useState<SelectOption[]>([]);
    const [favoriteTeams, setFavoriteTeams] = useState<SelectOption[]>([]);
    const [initialFavoriteTeams, setInitialFavoriteTeams] = useState<string[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('/api/users/current');
                if (!response.ok) {
                    throw new Error('Failed to fetch current user');
                }
                const data = await response.json();
                setUserId(data.id);
            } catch (error) {
                console.error('Error fetching current user:', error);
                alert('Failed to fetch user information.');
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId === null) return;

        let isMounted = true;

        const fetchTeams = async () => {
            try {
                const [teamsResponse, favoriteTeamsResponse] = await Promise.all([
                    fetch('/api/teams/mlb/teams'),
                    fetch(`/api/favorite-teams/user/${userId}`),
                ]);

                if (!teamsResponse.ok) {
                    throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
                }

                let favoriteTeamsData: Team[] = [];
                if (favoriteTeamsResponse.status !== 204) {
                    favoriteTeamsData = await favoriteTeamsResponse.json();
                }

                const teamsData = await teamsResponse.json();

                if (isMounted) {
                    const mappedTeams = teamsData?.teams?.map((team: Team) => ({
                        value: team.teamName,
                        label: team.teamName,
                    })) || [];

                    setTeams(mappedTeams);

                    const mappedFavorites = favoriteTeamsData.map((team) => ({
                        value: team.teamName,
                        label: team.teamName,
                    }));

                    setFavoriteTeams(mappedFavorites);
                    setInitialFavoriteTeams(favoriteTeamsData.map((team) => team.teamName));
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

    const saveFavoriteTeams = () => {
        if (userId === null) {
            alert("User ID is not available");
            return;
        }

        const selectedTeamNames = favoriteTeams.map((team) => team.value);
        const teamsToAdd = selectedTeamNames.filter((team) => !initialFavoriteTeams.includes(team));
        const teamsToRemove = initialFavoriteTeams.filter((team) => !selectedTeamNames.includes(team));

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
            <h1 className="profile-header">Profile</h1>
            <Link to="/" className="back-link">Back to schedule</Link>

            <Select
                options={teams}
                isMulti
                value={favoriteTeams}
                onChange={(selected) => setFavoriteTeams(selected as SelectOption[] || [])}
                placeholder="Select your favorite teams"
                className="team-select"
            />

            <button className="save-button" onClick={saveFavoriteTeams}>
                Save
            </button>
        </div>
    );
};

export default Profile;