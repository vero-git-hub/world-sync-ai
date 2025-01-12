import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import ScheduleContent from '../components/Schedule';

const SchedulePage: React.FC = () => {
    return (
        <BaseLayout>
            <ScheduleContent />
        </BaseLayout>
    );
};

export default SchedulePage;