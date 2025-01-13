import React from 'react';
import BaseLayout from '../../layouts/BaseLayout';
import TeamsContent from '../../components/team/Teams.tsx';

const TeamsPage: React.FC = () => {
    return (
        <BaseLayout>
            <TeamsContent />
        </BaseLayout>
    );
};

export default TeamsPage;