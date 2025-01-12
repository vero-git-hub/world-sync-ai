import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import ScheduleContent from '../components/schedule/Schedule.tsx';

const SchedulePage: React.FC = () => {
    return (
        <BaseLayout>
            <ScheduleContent />
        </BaseLayout>
    );
};

export default SchedulePage;