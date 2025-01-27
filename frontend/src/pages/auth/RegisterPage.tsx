import React from "react";
import AuthLayout from "../../layouts/AuthLayout.tsx";
import Register from "../../components/auth/Register.tsx";

const RegisterPage: React.FC = () => {
    return (
        <AuthLayout>
            <Register />
        </AuthLayout>
    );
};

export default RegisterPage;