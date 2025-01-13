import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Team {
    id: number;
    name: string;
    abbreviation: string;
    locationName: string;
    venue: {
        name: string;
    };
}

const Teams: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeams = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/teams/mlb/teams');
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.statusText}`);
            }
            const data = await response.json();
            setTeams(data.teams || []);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    if (loading) {
        return <p>Loading teams...</p>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="teams-container" style={{ padding: '20px' }}>
            <h1>All MLB Teams</h1>
            <div className="teams-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {teams.map((team) => (
                    <Link
                        to={`/team/${team.id}`}
                        key={team.id}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            textAlign: 'center',
                            width: '200px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h3>{team.name}</h3>
                        <p>{team.locationName}</p>
                        <p>Stadium: {team.venue.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Teams;