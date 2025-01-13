import React from 'react';
import BaseLayout from '../../layouts/BaseLayout.tsx';
import TeamContent from '../../components/team/TeamDetails.tsx';

const TeamPage: React.FC = () => {
    return (
        <BaseLayout>
            <TeamContent />
        </BaseLayout>
    );
};

export default TeamPage;