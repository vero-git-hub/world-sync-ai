import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface TeamInfo {
    id: number;
    name: string;
    venue: { name: string; city: string };
    league?: { name: string };
    division?: { name: string };
}

interface RosterPlayer {
    person: { fullName: string; id: number };
    position: { name: string };
}

const TeamDetails: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
    const [roster, setRoster] = useState<RosterPlayer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                setError("❌ No authentication token found. Please log in.");
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

                if (!response.ok) {
                    throw new Error(`Failed to fetch team data: ${response.statusText}`);
                }
                const data = await response.json();
                setTeamInfo(data.teamInfo.teams[0]);
                setRoster(data.roster);
            } catch (err) {
                console.error('Error fetching team data:', err);
                setError('Failed to load team data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId]);

    if (loading) return <p>Loading team details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Team Details</h1>
            <Link to="/schedule">Back to Schedule</Link>
            {teamInfo ? (
                <div>
                    <h2>{teamInfo.name}</h2>
                    <p><strong>Venue:</strong> {teamInfo.venue.name}, {teamInfo.venue.city}</p>
                    <p><strong>League:</strong> {teamInfo.league?.name || 'N/A'}</p>
                    <p><strong>Division:</strong> {teamInfo.division?.name || 'N/A'}</p>
                </div>
            ) : (
                <p>No team information available.</p>
            )}
            <h2>Roster</h2>
            <ul>
                {roster.map((player, index) => (
                    <li key={index}>
                        <Link
                            to={`/player/${player.person.id}`}
                            style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer' }}
                        >
                            {player.person.fullName}
                        </Link> - {player.position.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamDetails;