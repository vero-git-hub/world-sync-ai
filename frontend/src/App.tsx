import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;