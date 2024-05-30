import React from 'react';
import './Coin.css'; // Updated import statement to match the file name

function Coin({ coins, points }) {
    return (
        <div className="holder">
            <div className="points-display">
                <img src={"/images/mines.png"} alt="Points" className="point-image" />
                <span>{points}</span>
            </div>
            
            <div className="coin-display">
                <img src={"/images/coin.png"} alt="Coin" className="coin-image" />
                <span>{coins}</span>
            </div>
            
        </div>
    );
}

export default Coin;
