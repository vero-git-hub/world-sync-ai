import React, { ReactNode } from 'react';
import "../styles/layouts/BaseLayout.css";

interface LayoutProps {
    children: ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="base-container">
            <header className="base-header">
                <h1>World Sync AI</h1>
                <h2>Advanced AI Assistant</h2>
            </header>

            <main className="base-main">
                {children}
            </main>
        </div>
    );
};

export default BaseLayout;