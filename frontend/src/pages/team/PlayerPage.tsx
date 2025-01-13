import React from 'react';
import BaseLayout from '../../layouts/BaseLayout.tsx';
import PlayerContent from '../../components/team/PlayerDetails.tsx';

const PlayerPage: React.FC = () => {
    return (
        <BaseLayout>
            <PlayerContent />
        </BaseLayout>
    );
};

export default PlayerPage;