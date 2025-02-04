import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api.ts";
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

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            setError(null);

            try {
                const userToken = localStorage.getItem("token");
                if (!userToken) {
                    throw new Error("❌ No authentication token found. Please log in.");
                }

                const response = await API.get<{ teams: Team[] }>("/teams/mlb/teams", {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                setTeams(response.data.teams || []);

                response.data.teams.forEach((team: Team) => {
                    fetchTeamLogo(team.id, userToken);
                });

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const fetchTeamLogo = async (teamId: number, userToken: string) => {
        try {
            const logoResponse = await API.get<Blob>(
                `/teams/mlb/team/${teamId}/logo`,
                {
                    responseType: "blob",
                    headers: { Authorization: `Bearer ${userToken}` },
                }
            );
            const logoUrl = URL.createObjectURL(logoResponse.data);
            setLogos((prev) => ({ ...prev, [teamId]: logoUrl }));
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const filteredTeams = useMemo(() => {
        return teams
            .filter((team) =>
                team.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) =>
                sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
    }, [teams, searchTerm, sortOrder]);

    return (
        <div className="teams-page">
            <div className="glass-background">
                <h1 className="teams-title">⚾ All MLB Teams</h1>

                <div className="filters glass-background">
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button
                        onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                        className="sort-button"
                    >
                        Sort {sortOrder === "asc" ? "↓" : "↑"}
                    </button>
                    <button onClick={() => navigate("/schedule")}>⬅ Back</button>
                </div>

                {loading ? (
                    <p className="loading">Loading teams...</p>
                ) : error ? (
                    <div className="error-message">Error: {error}</div>
                ) : (
                    <div className="teams-list">
                        {filteredTeams.map((team) => (
                            <Link
                                to={`/team/${team.id}`}
                                key={team.id}
                                className="team-card"
                            >
                                <div className="team-card-inner">
                                    <div className="team-logo-container">
                                        {logos[team.id] ? (
                                            <img
                                                src={logos[team.id]}
                                                alt={`${team.name} logo`}
                                                className="team-logo"
                                            />
                                        ) : (
                                            <div className="team-logo-placeholder">
                                                🚫 No Logo
                                            </div>
                                        )}
                                    </div>
                                    <div className="team-info">
                                        <h3 className="team-name">
                                            {team.name}
                                        </h3>
                                        <p className="team-location">
                                            {team.locationName}
                                        </p>
                                        <p className="team-stadium">
                                            🏟 {team.venue.name}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Teams;