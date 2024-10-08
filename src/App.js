import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Use the correct path to your CSS file
import HomePage from './components/HomePage';
import Friends from './components/Friends'; 
import Games from './components/Games'; 
import Mines from './components/Mines'; 
import Footer from './components/Footer';
import Coin from './components/Coin'; // Correctly import the Coin component
import BlackJack from './components/BlackJack';
import Mining from './components/Mining';

function App() {
    const [coins, setCoins] = useState(0); // State for coins
    const [points, setPoints] = useState(0); // State for Points

    // Function to update coins
    function updateCoins(amount) {
        setCoins(prev => prev + amount);
    }
    
    // Function to update points 
    function updatePoints(amount) {
        setPoints(prev => prev + parseInt(amount));
    }

    return (
        <Router>
            <div className="App">
                <Coin coins={coins} points={points} updateCoins={updateCoins} updatePoints={updatePoints}/> {/* Always show the Coin component */}
                <Routes>
                    <Route path="/" element={<HomePage coins={coins} points={points} updateCoins={updateCoins} updatePoints={updatePoints} />} />
                    <Route path="/homepage" element={<HomePage coins={coins} updateCoins={updateCoins} updatePoints={updatePoints} />} />
                    <Route path="/games" element={<Games coins={coins} points={points} updateCoins={updateCoins} updatePoints={updatePoints} />} />
                    <Route path="/friends" element={<Friends coins={coins} points={points} updateCoins={updateCoins} updatePoints={updatePoints} />} />
                    <Route path="/mining" element={<Mining coins={coins} points={points} updateCoins={updateCoins} updatePoints={updatePoints} />} />
                    <Route path="/games/mines" element={<Mines coins={coins} points={points} updateCoins={updateCoins} updatePoints={updatePoints} />} />
                    <Route path="/games/blackjack" element={<BlackJack coins={coins} points={points} updateCoins={updateCoins} updatePoints={updatePoints} />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
