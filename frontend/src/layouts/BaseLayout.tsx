import React, { ReactNode } from 'react';
import Header from '../components/Header';
import "../styles/layouts/BaseLayout.css";

interface LayoutProps {
    children: ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="base-container">
            <Header />
            <main className="base-main">
                {children}
            </main>
        </div>
    );
};

export default BaseLayout;