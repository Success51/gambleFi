// src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import CSS for styling

function Footer() {
    return (
        <div className="footer">
            <nav>
                <ul>
                    <li><Link to="/homepage">Home</Link></li>
                    <li><Link to="/games">Games</Link></li>
                    <li><Link to="/friends">Friends</Link></li>
                    <li><Link to="/mine">Mine</Link></li>
                    {/* Add more links as needed */}
                </ul>
            </nav>
        </div>
    );
}

export default Footer;
