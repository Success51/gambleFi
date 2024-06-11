import React, { useState } from 'react';
import './CoinPurchaseModal.css'; // Import the CSS file for styling

const CoinPurchaseModal = ({ isOpen, onClose, onBuyCoins }) => {
    const [coinAmount, setCoinAmount] = useState(1);
    const [usdAmount, setUsdAmount] = useState(1 / 51);
    const [purchaseBy, setPurchaseBy] = useState('coins'); // 'coins' or 'usd'

    const handleOptionChange = (e) => {
        setPurchaseBy(e.target.value);
    };

    const handleCoinsChange = (e) => {
        const newCoinAmount = parseInt(e.target.value, 10);
        if (newCoinAmount >= 0 && newCoinAmount <= 10000) {
            setCoinAmount(newCoinAmount);
            setUsdAmount(newCoinAmount / 51);
        }
    };

    const handleUsdChange = (e) => {
        const newUsdAmount = parseFloat(e.target.value);
        if (newUsdAmount >= 0 && newUsdAmount <= (10000 / 51)) {
            setUsdAmount(newUsdAmount);
            setCoinAmount(newUsdAmount * 51);
        }
    };

    const handleBuy = () => {
        onBuyCoins(purchaseBy === 'coins' ? coinAmount : usdAmount * 51);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-header">Buy Gambly Coins</h2>
                <div className="purchase-options">
                    <label className="option">
                        <input
                            type="radio"
                            value="coins"
                            checked={purchaseBy === 'coins'}
                            onChange={handleOptionChange}
                        />
                        By Coins
                    </label>
                    <label className="option">
                        <input
                            type="radio"
                            value="usd"
                            checked={purchaseBy === 'usd'}
                            onChange={handleOptionChange}
                        />
                        By USD
                    </label>
                </div>
                <div className="input-container">
                    {purchaseBy === 'coins' ? (
                        <input
                            type="number"
                            value={coinAmount}
                            min={0}
                            max={10000}
                            onChange={handleCoinsChange}
                            step={1}
                        />
                    ) : (
                        <input
                            type="number"
                            value={usdAmount}
                            min={0}
                            max={10000 / 51}
                            onChange={handleUsdChange}
                            step={0.01}
                        />
                    )}
                </div>
                {purchaseBy === 'coins' ? (
                    <button onClick={handleBuy}>Buy for ${usdAmount.toFixed(2)}</button>
                ) : (
                    <button onClick={handleBuy}>Get {coinAmount} Gambly</button>
                )}
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CoinPurchaseModal;
