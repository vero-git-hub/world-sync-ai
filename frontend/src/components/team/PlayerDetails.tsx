import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "../../styles/components/team/PlayerDetails.css";
import { PlayerInfo, LocationState, PlayerApiResponse } from "../../types/player.ts";
import API from "../../api.ts";

const PlayerDetails: React.FC = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
    const [playerPhoto, setPlayerPhoto] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const state = location.state as LocationState | null;
    const previousTeamPath = state?.fromTeamPath || "/teams";

    useEffect(() => {
        const fetchPlayerData = async () => {
            setLoading(true);
            setError(null);

            try {
                const playerResponse = await API.get<PlayerApiResponse>(`/players/${playerId}`);

                if (playerResponse.data.people && playerResponse.data.people.length > 0) {
                    setPlayerInfo(playerResponse.data.people[0]);
                } else {
                    throw new Error("No player data found.");
                }

                const photoResponse = await API.get<{ url: string }>(`/players/${playerId}/photo`);
                setPlayerPhoto(photoResponse.data.url);
            } catch (err) {
                console.error("❌ Error fetching player data:", err);
                setError("Failed to load player data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [playerId]);

    if (loading) return <p className="loading">Loading player details...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="player-page">
            <div className="glass-container">
                <Link to={previousTeamPath} className="back-button">⬅ Back to Team</Link>

                {playerInfo ? (
                    <div className="player-card">
                        {playerPhoto && <img src={playerPhoto} alt={playerInfo.fullName} className="player-photo" />}
                        <h1 className="player-name">{playerInfo.fullName}</h1>
                        <p className="player-details"><strong>🎂 Birth Date:</strong> {playerInfo.birthDate}</p>
                        <p className="player-details"><strong>🎯 Age:</strong> {playerInfo.currentAge}</p>
                        <p className="player-details"><strong>⚾ Position:</strong> {playerInfo.primaryPosition.name}</p>
                        <p className="player-details"><strong>📏 Height:</strong> {playerInfo.height}</p>
                        <p className="player-details"><strong>⚖️ Weight:</strong> {playerInfo.weight} lbs</p>
                        <p className="player-details"><strong>🛫 MLB Debut:</strong> {playerInfo.mlbDebutDate}</p>
                        <p className="player-details"><strong>🦾 Bat Side:</strong> {playerInfo.batSide.description}</p>
                        <p className="player-details"><strong>💪 Pitch Hand:</strong> {playerInfo.pitchHand.description}</p>
                    </div>
                ) : (
                    <p>No player information available.</p>
                )}
            </div>
        </div>
    );
};

export default PlayerDetails;