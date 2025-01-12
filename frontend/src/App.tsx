import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage.tsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<SchedulePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;