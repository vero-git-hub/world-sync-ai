import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Schedule from './components/Schedule.tsx';
import Profile from './components/Profile.tsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Schedule />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;