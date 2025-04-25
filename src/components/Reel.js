import React, { useEffect, useState } from 'react';

const symbols = ['🍒', '🍋', '🔔', '🍉', '💎', '7️⃣'];

const Reel = ({ spinning, onStop }) => {
  const [currentSymbol, setCurrentSymbol] = useState('🍒');

  useEffect(() => {
    let interval;
    if (spinning) {
      interval = setInterval(() => {
        const random = symbols[Math.floor(Math.random() * symbols.length)];
        setCurrentSymbol(random);
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        const final = symbols[Math.floor(Math.random() * symbols.length)];
        setCurrentSymbol(final);
        onStop(final); // tell parent the final symbol
      }, 1500 + Math.random() * 1000); // slightly different timing for each reel
    }
    return () => clearInterval(interval);
  }, [spinning]);

  return (
    <div className="reel">
      <div className="symbol">{currentSymbol}</div>
    </div>
  );
};

export default Reel;
