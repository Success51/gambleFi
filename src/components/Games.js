// src/components/Games.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Games.css'; // Import CSS for styling

function Games() {
    return (
        <div className="home-page">
            <section className="games">
                <h2>Play to Earn</h2>
                <div className="game-list">
                    <div className="game">
                        <Link to="/games/mines" className='game-link'>
                            <img src="/images/mines.png" alt="Mines" />
                            <p>Play Mines</p>
                        </Link>
                    </div>
                    <div className="game">
                        <Link to="/games/mines" className='game-link'>
                            <img src="/images/mines.png" alt="mines" />
                            <p>Game 2</p>
                        </Link>
                    </div>
                    {/* Add more games as needed */}
                </div>
            </section>
        </div>
    );
}

export default Games;
