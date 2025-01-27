import React from "react";
import AuthLayout from "../../layouts/AuthLayout.tsx";
import Login from "../../components/auth/Login.tsx";

const LoginPage: React.FC = () => {
    return (
        <AuthLayout>
            <Login />
        </AuthLayout>
    );
};

export default LoginPage;