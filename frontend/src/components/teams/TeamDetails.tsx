import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const TeamDetails: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const [roster, setRoster] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const response = await fetch(`/api/teams/mlb/team/${teamId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch team data: ${response.statusText}`);
                }
                const data = await response.json();
                setRoster(data.roster);
            } catch (err) {
                console.error(`Error fetching team data:`, err);
                setError('Failed to fetch team data.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamDetails();
    }, [teamId]);

    if (loading) return <p>Loading team details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Team Roster</h1>
            <Link to="/schedule">Back to Schedule</Link>
            <ul>
                {roster.map((player: any, index: number) => (
                    <li key={index}>
                        {player.person.fullName} - {player.position.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamDetails;