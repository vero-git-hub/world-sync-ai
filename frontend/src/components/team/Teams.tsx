import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/components/team/Teams.css";

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
    const [logos, setLogos] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const navigate = useNavigate();

    const fetchTeams = async () => {
        setLoading(true);
        setError(null);

        try {
            const userToken = localStorage.getItem("token");
            if (!userToken) {
                throw new Error("❌ No authentication token found. Please log in.");
            }

            const response = await fetch('/api/teams/mlb/teams', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.statusText}`);
            }

            const data = await response.json();
            setTeams(data.teams || []);

            const logoPromises = data.teams.map(async (team: Team) => {
                const logoResponse = await axios.get<Blob>(
                    `/api/teams/mlb/team/${team.id}/logo`,
                    {
                        responseType: 'blob',
                        headers: { "Authorization": `Bearer ${userToken}` },
                    }
                );

                const logoUrl = URL.createObjectURL(logoResponse.data);
                return { [team.id]: logoUrl };
            });

            const logosArray = await Promise.all(logoPromises);
            setLogos(Object.assign({}, ...logosArray));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const filteredTeams = teams
        .filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    if (loading) {
        return <p className="loading">Loading teams...</p>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="teams-page">
            <h1 className="teams-title">⚾ All MLB Teams</h1>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="sort-button">
                    Sort {sortOrder === "asc" ? "↓" : "↑"}
                </button>
                <button onClick={() => navigate("/")} className="back-button">⬅ Back</button>
            </div>

            <div className="teams-list">
                {filteredTeams.map((team) => (
                    <Link to={`/team/${team.id}`} key={team.id} className="team-card">
                        <div className="team-card-inner">
                            <div className="team-logo-container">
                                {logos[team.id] && (
                                    <img
                                        src={logos[team.id]}
                                        alt={`${team.name} logo`}
                                        className="team-logo"
                                    />
                                )}
                            </div>
                            <div className="team-info">
                                <h3 className="team-name">{team.name}</h3>
                                <p className="team-location">{team.locationName}</p>
                                <p className="team-stadium">🏟 {team.venue.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Teams;