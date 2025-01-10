import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const teams = [
    "Los Angeles Dodgers",
    "Chicago Cubs",
    "New York Yankees",
    "Baltimore Orioles",
];

const Profile: React.FC = () => {
    const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);

    useEffect(() => {
        const savedTeams = JSON.parse(localStorage.getItem('favoriteTeams') || '[]');
        setFavoriteTeams(savedTeams);
    }, []);

    const handleTeamToggle = (team: string) => {
        setFavoriteTeams((prev) =>
            prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
        );
    };

    const saveFavoriteTeams = () => {
        localStorage.setItem('favoriteTeams', JSON.stringify(favoriteTeams));
        alert('Favorite teams saved!');
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <Link to="/">
                <button>Back to schedule</button>
            </Link>
            <ul>
                {teams.map((team) => (
                    <li key={team}>
                        <label>
                            <input
                                type="checkbox"
                                checked={favoriteTeams.includes(team)}
                                onChange={() => handleTeamToggle(team)}
                            />
                            {team}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={saveFavoriteTeams}>Save</button>
        </div>
    );
};

export default Profile;