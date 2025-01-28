import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import "../../styles/components/team/TeamDetails.css";
import { TeamInfo, RosterPlayer } from "../../types/team.ts";
import axios from "axios";

const TeamDetails: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
    const [roster, setRoster] = useState<RosterPlayer[]>([]);
    const [teamLogo, setTeamLogo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                setError("❌ No authentication token found. Redirecting to login...");
                setTimeout(() => window.location.href = "/login", 2000);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/teams/mlb/team/${teamId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 401) {
                    setError("❌ Your session has expired. Redirecting to login...");
                    localStorage.removeItem("token");
                    setTimeout(() => window.location.href = "/login", 2000);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch team data: ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.teamInfo || !data.teamInfo.teams || data.teamInfo.teams.length === 0) {
                    throw new Error("No team information available.");
                }

                setTeamInfo(data.teamInfo.teams[0]);
                setRoster(data.roster || []);

                const logoResponse = await axios.get<Blob>(`/api/teams/mlb/team/${teamId}/logo`, {
                    responseType: 'blob',
                    headers: { "Authorization": `Bearer ${token}` },
                });

                const logoUrl = URL.createObjectURL(logoResponse.data);
                setTeamLogo(logoUrl);
            } catch (err) {
                console.error('❌ Error fetching team data:', err);
                setError(`Failed to load team data. ${err instanceof Error ? err.message : ''}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId]);

    if (loading) return <p className="loading">Loading team details...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="team-page">
            <Link to="/teams" className="back-button">⬅ Back to Teams</Link>

            {teamInfo ? (
                <div className="team-card">
                    {teamLogo && <img src={teamLogo} alt={teamInfo.name} className="team-logo"/>}
                    <h1 className="team-name">{teamInfo.name}</h1>
                    <p className="team-details"><strong>🏟 Venue:</strong> {teamInfo.venue.name}, {teamInfo.venue.city}</p>
                    <p className="team-details"><strong>🏆 League:</strong> {teamInfo.league?.name || 'N/A'}</p>
                    <p className="team-details"><strong>⚾ Division:</strong> {teamInfo.division?.name || 'N/A'}</p>
                </div>
            ) : (
                <p>No team information available.</p>
            )}

            <h2 className="roster-title">📋 Team Roster</h2>
            <div className="roster-grid">
                {roster.map((player, index) => (
                    <button
                        key={index}
                        className="player-card"
                        onClick={() => navigate(`/player/${player.person.id}`, { state: { fromTeamPath: `/team/${teamId}` } })}
                    >
                        <p className="player-name">{player.person.fullName}</p>
                        <span className="player-position">{player.position.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TeamDetails;