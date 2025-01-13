import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';
import TeamPage from './pages/team/TeamPage.tsx';
import TeamsPage from './pages/team/TeamsPage.tsx';
import PlayerPage from './pages/team/PlayerPage.tsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/team/:teamId" element={<TeamPage />} />
                    <Route path="/teams" element={<TeamsPage />} />
                    <Route path="/player/:playerId" element={<PlayerPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;