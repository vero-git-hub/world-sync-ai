import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';
import TeamPage from './pages/team/TeamPage.tsx';
import TeamsPage from './pages/team/TeamsPage.tsx';
import PlayerPage from './pages/team/PlayerPage.tsx';
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import {AuthProvider} from "./components/auth/AuthContext.tsx";
import {ScheduleProvider} from "./components/schedule/ScheduleContext.tsx";
import Register from "./pages/auth/Register.tsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScheduleProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/schedule" element={<SchedulePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/team/:teamId" element={<TeamPage />} />
                            <Route path="/teams" element={<TeamsPage />} />
                            <Route path="/player/:playerId" element={<PlayerPage />} />
                        </Route>
                    </Routes>
                </ScheduleProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;