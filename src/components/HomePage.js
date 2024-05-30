// src/components/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import CSS for styling

function HomePage() {
    return (
        <div className="home-page">
            <header className="banner">
                <h1>Welcome to Telegram GameFi</h1>
                <p>When there is risk , there is huge reward.</p>
            </header>
            
        
            
            <section className="games">
                <h2>Play to Earn
                <a className=""><Link to="/games" className='moreArrow'>→</Link></a>
                </h2>
                <div className="game-list">
                    <div className="game">
                        <Link to="/games/mines" className='game-link'>
                            <img src="/images/mines.png" alt="Mines" />
                            <p>Play Mines</p>
                        </Link>
                    </div>

                    <div className="game">
                        <Link to="/games/mines" className='game-link'>
                            <img src="/images/mines.png" alt="Mines" />
                            <p>Play Mines</p>
                        </Link>
                    </div>

                </div>
            </section>
            
            <section className="how-it-works">
                <h2>How It Works</h2>
                <ol>
                    <li>Step 1: Do this first.</li>
                    <li>Step 2: Then do this.</li>
                    <li>Step 3: Finally, do this.</li>
                </ol>
            </section>
        </div>
    );
}

export default HomePage;
