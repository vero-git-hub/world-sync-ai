import React from 'react';
import "../styles/components/Home.css";
import {Link} from "react-router-dom";

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <div className="widget big-widget">
                <h2>Advanced AI Assistant</h2>
                <div className="widget-content">
                    <img src="/images/globe.jpg" alt="Globe" className="globe-image"/>
                </div>
            </div>

            <div className="widget schedule-widget">
                <h2>Schedule</h2>
                <Link to="/schedule">To schedule</Link>
                <p>Next game: Detroit Tigers vs Los Angeles Dodgers</p>
                <p>Time: 01:10 | Venue: Dodger Stadium</p>
            </div>

            <div className="widget profile-widget">
                <h2>Favorites</h2>
                <p>Favorite Team: Mets</p>
                <p>Games this week: 3</p>
            </div>

            <div className="widget field-widget">
                <h2>Game Field</h2>
                <img src="/images/field.jpg" alt="Field" className="field-image"/>
            </div>

            <div className="widget insights-widget">
                <h2>Insights</h2>
                <p>Win Rate: 75%</p>
                <p>Top Player: John Doe</p>
            </div>

            <div className="widget teams-widget">
                <h2>Teams</h2>
                <Link to="/teams">To teams</Link>
            </div>
        </div>
    );
};

export default HomePage;