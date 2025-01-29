import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import "../../styles/components/team/TeamDetails.css";
import { TeamInfo, RosterPlayer, TeamApiResponse } from "../../types/team.ts";
import API from "../../api.ts";

const TeamDetails: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
    const [roster, setRoster] = useState<RosterPlayer[]>([]);
    const [teamLogo, setTeamLogo] = useState<string | null>(null);
    const [playerPhotos, setPlayerPhotos] = useState<{ [key: number]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            setError(null);

            try {
                const teamResponse = await API.get<TeamApiResponse>(`/teams/mlb/team/${teamId}`);
                if (!teamResponse.data.teamInfo || !teamResponse.data.teamInfo.teams.length) {
                    throw new Error("No team information available.");
                }

                setTeamInfo(teamResponse.data.teamInfo.teams[0]);
                setRoster(teamResponse.data.roster || []);

                const logoResponse = await API.get<{ url: string }>(`/teams/mlb/team/${teamId}/logo`);
                setTeamLogo(logoResponse.data.url);
            } catch (err) {
                console.error('❌ Error fetching team data:', err);
                setError(`Failed to load team data.`);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId]);

    useEffect(() => {
        const fetchPlayerPhotos = async () => {
            const photos: { [key: number]: string } = {};

            await Promise.all(
                roster.map(async (player) => {
                    try {
                        const photoResponse = await API.get<{ url: string }>(`/players/${player.person.id}/photo`);
                        photos[player.person.id] = photoResponse.data.url;
                    } catch (error) {
                        console.error("❌ Error fetching photo:", error);
                    }
                })
            );

            setPlayerPhotos(photos);
        };

        if (roster.length > 0) {
            fetchPlayerPhotos();
        }
    }, [roster]);

    if (loading) return <p className="loading">Loading team details...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="team-page">
            <Link to="/teams" className="back-button">⬅ Back to Teams</Link>

            {teamInfo && (
                <div className="team-card">
                    {teamLogo && <img src={teamLogo} alt={teamInfo.name} className="team-logo" />}
                    <h1 className="team-name">{teamInfo.name}</h1>
                    <p className="team-details"><strong>🏟 Venue:</strong> {teamInfo.venue.name}, {teamInfo.venue.city}</p>
                    <p className="team-details"><strong>🏆 League:</strong> {teamInfo.league?.name || 'N/A'}</p>
                    <p className="team-details"><strong>⚾ Division:</strong> {teamInfo.division?.name || 'N/A'}</p>
                </div>
            )}

            <h2 className="roster-title">📋 Team Roster</h2>
            <div className="roster-grid">
                {roster.map((player) => (
                    <button
                        key={player.person.id}
                        className="player-card"
                        onClick={() => navigate(`/player/${player.person.id}`, { state: { fromTeamPath: `/team/${teamId}` } })}
                    >
                        {playerPhotos[player.person.id] ? (
                            <img src={playerPhotos[player.person.id]} alt={player.person.fullName} className="player-photo" />
                        ) : (
                            <div className="player-photo-placeholder">🚫 No Image</div>
                        )}
                        <p className="player-name">{player.person.fullName}</p>
                        <span className="player-position">{player.position.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TeamDetails;