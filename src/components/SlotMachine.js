import React, { useState } from 'react';
import './SlotMachine.css';

const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍌', '🍍'];

// Helper to generate a random grid
const generateRandomGrid = () => {
  return Array(5).fill().map(() =>
    Array(5).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)])
  );
};

function SlotMachine({ coins, points, updateCoins, updatePoints }) {
  const [grid, setGrid] = useState(generateRandomGrid());
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [message, setMessage] = useState('');
  const [winningCells, setWinningCells] = useState([]);
  const spinSound = new Audio('/sounds/gemSound.wav');


  const spinReels = () => {
    if (isSpinning || betAmount > coins) return;
  
    setIsSpinning(true);
    setMessage('');
    setWinningCells([]);
    updateCoins(-betAmount);
  
    const spinDuration = 1000;
    const spinInterval = 75;
    let spinCount = 0;
  
    // Create a deep copy to animate
    let currentGrid = Array(5).fill().map(() => Array(5).fill('🍒'));
    const interval = setInterval(() => {
      spinSound.currentTime = 0;
spinSound.play();

      currentGrid = currentGrid.map(row =>
        row.map(() => symbols[Math.floor(Math.random() * symbols.length)])
      );
      
      setGrid([...currentGrid]);
      spinCount += spinInterval;
    }, spinInterval);
    
    setTimeout(() => {
      clearInterval(interval);
      
      const finalGrid = currentGrid.map(row =>
        row.map(() => symbols[Math.floor(Math.random() * symbols.length)])
      );
  
      setGrid(finalGrid);
      checkWin(finalGrid);
      setIsSpinning(false);
    }, spinDuration);
  };
  

  const checkWin = (grid) => {
    let payout = 0;
    const cells = [];

    const calculatePayout = (matches) => {
      if (matches === 5) return 10;
      if (matches === 4) return 3;
      if (matches === 3) return 2;
      return 0;
    };

    // Check rows
    for (let row = 0; row < 5; row++) {
      let count = 1;
      for (let col = 1; col < 5; col++) {
        if (grid[row][col] === grid[row][col - 1]) {
          count++;
        } else {
          if (count >= 3) {
            payout += calculatePayout(count);
            for (let i = col - count; i < col; i++) {
              cells.push({ row, col: i });
            }
          }
          count = 1;
        }
      }
      if (count >= 3) {
        payout += calculatePayout(count);
        for (let i = 5 - count; i < 5; i++) {
          cells.push({ row, col: i });
        }
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      let count = 1;
      for (let row = 1; row < 5; row++) {
        if (grid[row][col] === grid[row - 1][col]) {
          count++;
        } else {
          if (count >= 3) {
            payout += calculatePayout(count);
            for (let i = row - count; i < row; i++) {
              cells.push({ row: i, col });
            }
          }
          count = 1;
        }
      }
      if (count >= 3) {
        payout += calculatePayout(count);
        for (let i = 5 - count; i < 5; i++) {
          cells.push({ row: i, col });
        }
      }
    }

    // Diagonal TL-BR
    for (let r = 0; r <= 2; r++) {
      for (let c = 0; c <= 2; c++) {
        const base = grid[r][c];
        let matchLength = 1;
        for (let o = 1; o < 5 && r + o < 5 && c + o < 5; o++) {
          if (grid[r + o][c + o] === base) {
            matchLength++;
          } else break;
        }
        if (matchLength >= 3) {
          payout += calculatePayout(matchLength);
          for (let i = 0; i < matchLength; i++) {
            cells.push({ row: r + i, col: c + i });
          }
        }
      }
    }

    // Diagonal TR-BL
    for (let r = 0; r <= 2; r++) {
      for (let c = 2; c <= 4; c++) {
        const base = grid[r][c];
        let matchLength = 1;
        for (let o = 1; o < 5 && r + o < 5 && c - o >= 0; o++) {
          if (grid[r + o][c - o] === base) {
            matchLength++;
          } else break;
        }
        if (matchLength >= 3) {
          payout += calculatePayout(matchLength);
          for (let i = 0; i < matchLength; i++) {
            cells.push({ row: r + i, col: c - i });
          }
        }
      }
    }

    if (payout > 1) {
      setMessage(`You win! Payout: ${payout}x`);
      updateCoins(betAmount * payout);
    } else {
      setMessage('You lose. Try again!');
    }

    setWinningCells(cells);
  };

  return (
    <div className="slot-machine">
      <h1>Slot Machine</h1><br/>

      <div className="game-container">
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="cell-row">
              {row.map((symbol, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${winningCells.some(c => c.row === rowIndex && c.col === colIndex) ? 'winning-cell' : ''}`}
                >
                  {symbol}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="bet-portion">
          <label>Bet Amount: </label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={coins}
            className='bet-input'
            style={{ height: '40px', fontSize: '20px', padding: '10px', margin: '10px', maxWidth: '80%' }}
          />

          <>
            <button className='half' disabled={isSpinning} onClick={() => setBetAmount(Math.max(1, Math.floor(betAmount * 0.5)))}>1/2</button>
            <button className='double' disabled={isSpinning} onClick={() => setBetAmount(Math.min(coins, betAmount * 2))}>2x</button>
            <button className='Min' disabled={isSpinning} onClick={() => setBetAmount(1)}>Min</button>
            <button className='Max' disabled={isSpinning} onClick={() => setBetAmount(Math.max(1, coins))}>Max</button>
          </>
          <br />

          <button className='spinBTN' onClick={spinReels} disabled={isSpinning || betAmount > coins}>
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
          <div className="message">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlotMachine;
