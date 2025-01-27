import React, { ReactNode } from "react";
import "../styles/layouts/AuthLayout.css";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="auth-container">
            {children}
        </div>
    );
};

export default AuthLayout;