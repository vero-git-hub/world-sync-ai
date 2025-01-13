import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import TeamContent from '../components/teams/TeamDetails.tsx';

const TeamPage: React.FC = () => {
    return (
        <BaseLayout>
            <TeamContent />
        </BaseLayout>
    );
};

export default TeamPage;