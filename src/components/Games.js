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
                            <p>Mines</p>
                        </Link>
                    </div>
                    <div className="game">
                        <Link to="/games/blackjack" className='game-link'>
                            <img src="/images/mines.png" alt="Black Jack" />
                            <p>Black Jack</p>
                        </Link>
                    </div>
                    {/* Add more games as needed */}
                </div>
            </section>
        </div>
    );
}

export default Games;
