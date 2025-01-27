import React, { useState } from "react";
import "../../styles/components/auth/Login.css";
import API from "../../api.ts";
import { Link } from "react-router-dom";

interface AuthResponse {
    token: string;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await API.post<AuthResponse>("/auth/login", {
                username,
                password
            });

            const data = response.data;
            localStorage.setItem("token", data.token);

            window.location.href = "/";
        } catch (error) {
            console.error("❌ Login error:", error);
            setError("Invalid username or password");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="login-button">Login</button>
            </form>

            <p className="register-link">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default Login;