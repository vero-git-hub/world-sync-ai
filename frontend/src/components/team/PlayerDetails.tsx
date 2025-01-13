import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface PlayerInfo {
    id: number;
    fullName: string;
    birthDate: string;
    currentAge: number;
    primaryPosition: { name: string };
    height: string;
    weight: number;
    mlbDebutDate: string;
    batSide: { description: string };
    pitchHand: { description: string };
}

const PlayerDetails: React.FC = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await fetch(`/api/players/${playerId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch player data: ${response.statusText}`);
                }
                const data = await response.json();

                if (data.people && data.people.length > 0) {
                    setPlayerInfo(data.people[0]);
                } else {
                    throw new Error('No player data found.');
                }
            } catch (err) {
                console.error('Error fetching player data:', err);
                setError('Failed to load player data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [playerId]);

    if (loading) return <p>Loading player details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Player Details</h1>
            <Link to="/schedule">Back to Schedule</Link>

            {playerInfo ? (
                <div>
                    <h2>{playerInfo.fullName}</h2>
                    <p><strong>Birth Date:</strong> {playerInfo.birthDate}</p>
                    <p><strong>Age:</strong> {playerInfo.currentAge}</p>
                    <p><strong>Primary Position:</strong> {playerInfo.primaryPosition.name}</p>
                    <p><strong>Height:</strong> {playerInfo.height}</p>
                    <p><strong>Weight:</strong> {playerInfo.weight} lbs</p>
                    <p><strong>MLB Debut:</strong> {playerInfo.mlbDebutDate}</p>
                    <p><strong>Bat Side:</strong> {playerInfo.batSide.description}</p>
                    <p><strong>Pitch Hand:</strong> {playerInfo.pitchHand.description}</p>
                </div>
            ) : (
                <p>No player information available.</p>
            )}
        </div>
    );
};

export default PlayerDetails;