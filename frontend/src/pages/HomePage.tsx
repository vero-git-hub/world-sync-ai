import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Home from '../components/Home';

const HomePage: React.FC = () => {
    return (
        <BaseLayout>
            <Home />
        </BaseLayout>
    );
};

export default HomePage;