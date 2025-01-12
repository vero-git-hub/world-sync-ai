import React from 'react';
import "../../styles/components/schedule/SelectedTeams.css";

interface SelectedTeamsProps {
    favoriteTeams: string[];
}

const SelectedTeams: React.FC<SelectedTeamsProps> = ({ favoriteTeams }) => {
    return (
        <div className="selected-teams">
            {favoriteTeams.map((team, index) => (
                <div key={index} className="team-chip">
                    {team}
                </div>
            ))}
        </div>
    );
};

export default SelectedTeams;