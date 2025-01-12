import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Profile from '../components/Profile';

const ProfilePage: React.FC = () => {
    return (
        <BaseLayout>
            <Profile />
        </BaseLayout>
    );
};

export default ProfilePage;