import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchedulePage from './pages/SchedulePage';
import Profile from './components/Profile.tsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<SchedulePage />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;