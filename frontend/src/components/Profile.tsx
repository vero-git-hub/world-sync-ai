import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { Team } from "../types/schedule.ts";
import "../styles/components/Profile.css";
import { SelectOption, UserData } from "../types/profile.ts";
import API from "../api.ts";

const Profile: React.FC = () => {
    const [teams, setTeams] = useState<SelectOption[]>([]);
    const [favoriteTeams, setFavoriteTeams] = useState<SelectOption[]>([]);
    const [initialFavoriteTeams, setInitialFavoriteTeams] = useState<string[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const [hasGoogleCalendarToken, setHasGoogleCalendarToken] = useState(false);
    const [calendarStatus, setCalendarStatus] = useState<string>("🔄 Checking Google Calendar...");

    const userToken = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get<UserData>('/users/current');
                setUserId(response.data.id);
                setUsername(response.data.username);
                setEmail(response.data.email);

                if (response.data.hasGoogleCalendarToken) {
                    setHasGoogleCalendarToken(true);
                    checkCalendarToken();
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
                alert('Failed to fetch user information.');
            }
        };

        fetchUserData();
    }, []);

    const checkCalendarToken = async () => {
        if (!userToken) {
            setCalendarStatus("🔴 You are not logged in");
            return;
        }

        try {
            const response = await axios.get('/api/google/calendar/check', {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            if (response.data === "valid") {
                setCalendarStatus("✅ Google Calendar is connected");
            } else if (response.data === "expired") {
                setCalendarStatus("⚠️ Token expired, reconnection required");
            } else if (response.data === "no_token") {
                setCalendarStatus("🔴 Google Calendar is not connected");
            }
        } catch (error) {
            console.error("❌ Error checking Google Calendar:", error);
            setCalendarStatus("Error checking");
        }
    };

    useEffect(() => {
        if (userId === null) return;

        const fetchTeams = async () => {
            try {
                const [teamsResponse, favoriteTeamsResponse] = await Promise.all([
                    API.get<{ teams: Team[] }>('/teams/mlb/teams'),
                    API.get(`/favorite-teams/user/${userId}`),
                ]);

                const mappedTeams = teamsResponse.data.teams.map((team) => ({
                    value: team.teamName,
                    label: team.teamName,
                }));

                let mappedFavorites: SelectOption[] = [];
                if (favoriteTeamsResponse.data && Array.isArray(favoriteTeamsResponse.data)) {
                    mappedFavorites = favoriteTeamsResponse.data.map((team) => ({
                        value: team.teamName,
                        label: team.teamName,
                    }));
                }

                setTeams(mappedTeams);
                setFavoriteTeams(mappedFavorites);
                setInitialFavoriteTeams(mappedFavorites.map((team) => team.value));
            } catch (error) {
                console.error('❌ Error loading data:', error);
                alert('Failed to load data. Please try again later.');
            }
        };

        fetchTeams();
    }, [userId]);

    const saveFavoriteTeams = async () => {
        if (userId === null) {
            alert("❌ User ID is not available");
            return;
        }

        const selectedTeamNames = favoriteTeams.map((team) => team.value);
        const teamsToAdd = selectedTeamNames.filter((team) => !initialFavoriteTeams.includes(team));
        const teamsToRemove = initialFavoriteTeams.filter((team) => !selectedTeamNames.includes(team));

        try {
            if (teamsToAdd.length > 0) {
                await API.post(`/favorite-teams/user/${userId}/update`, {
                    action: "add",
                    teamNames: teamsToAdd,
                });
            }

            if (teamsToRemove.length > 0) {
                await API.post(`/favorite-teams/user/${userId}/update`, {
                    action: "remove",
                    teamNames: teamsToRemove,
                });
            }

            alert("✅ Changes saved successfully!");
            setInitialFavoriteTeams(selectedTeamNames);
        } catch (error) {
            console.error("❌ Error updating favorite teams:", error);
            alert("Failed to save changes. Please try again.");
        }
    };

    const connectGoogleCalendar = async () => {
        try {
            if (!userToken) {
                alert("❌ You are not authenticated!");
                return;
            }

            window.open(`http://localhost:8080/api/google/calendar/auth?auth=${userToken}`, '_blank');
        } catch (error) {
            console.error('Error connecting Google Calendar:', error);
            alert('Failed to connect Google Calendar.');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1 className="profile-header">⚾ Profile</h1>
                <Link to="/" className="back-link">⬅ Back to Home</Link>

                <div className="user-info">
                    <p ><strong>Username:</strong> {username || "Not Available"}</p>
                    <p><strong>Email:</strong> {email || "Not Available"}</p>
                </div>

                <Select
                    options={teams}
                    isMulti
                    value={favoriteTeams}
                    onChange={(selected) => setFavoriteTeams(selected as SelectOption[] || [])}
                    placeholder="Select your favorite teams"
                    className="team-select"
                />

                <button className="save-button" onClick={saveFavoriteTeams}>💾 Save Changes</button>

                {!hasGoogleCalendarToken && (
                    <button className="connect-google-button" onClick={connectGoogleCalendar}>
                        🔗 Connect Google Calendar
                    </button>
                )}

                {hasGoogleCalendarToken && (
                    <>
                        <p className="calendar-status">{calendarStatus}</p>
                        {(calendarStatus.includes("expired") || calendarStatus.includes("not connected")) && (
                            <button className="connect-google-button" onClick={connectGoogleCalendar}>
                                🔄 Reconnect Google Calendar
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;