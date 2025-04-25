// src/components/navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import CSS for styling
import Coin from './Coin';

function Navbar() {
    return (
        <div className="navbar">
            <nav>
                <ul>
                    <li><Link to="/homepage">Home</Link></li>
                    <li><Link to="/games">Games</Link></li>
                    <li><Link to="/friends">Friends</Link></li>
                    <li><Link to="/mining">Mine</Link></li>
                    {/* Add more links as needed */}
                </ul>

            </nav>
        </div>
    );
}

export default Navbar;
