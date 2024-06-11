import React, { useState, useEffect } from 'react';
import './Mines.css'; // Import CSS for styling

function Mines({ updateCoins, coins }) {
    const gemSound = new Audio('/sounds/gemSound.wav');
    const bombSound = new Audio('/sounds/bomb.wav');
    const [board, setBoard] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [numMines, setNumMines] = useState(1); // Default number of mines
    const [betAmount, setBetAmount] = useState(1); // Default bet amount
    const [hasStarted, setHasStarted] = useState(false);
    const [profitBoxStyle, setProfitBoxStyle] = useState("none");
    const [profitAmount, setProfitAmount] = useState(betAmount);
    const [buttonText, setButtonText] = useState("Bet");
    const [gemOpened, setGemOpened] = useState(1);
    const [showCashoutBox, setShowCashoutBox] = useState(false);
    const [multiplier, setMultiplier] = useState(1);

    let profitVar;

    useEffect(() => {
        const initialBoard = createBoard(5, 5, numMines); // Create a 5x5 board with the specified number of mines
        setBoard(initialBoard);
    }, [numMines]);

    function createBoard(rows, cols, mines) {
        const board = Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => ({ mine: false, revealed: false }))
        );

        let placedMines = 0;
        while (placedMines < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);

            if (!board[row][col].mine) {
                board[row][col].mine = true;
                placedMines++;
            }
        }

        return board;
    }

    function cashOut(row , col) {
        if (profitAmount <= betAmount && profitAmount != 0 ) return;
        
        updateCoins(profitAmount);
        setShowCashoutBox(true);
        
        setGameOver(true);
        setHasStarted(false);
        setButtonText("Bet");
        setProfitBoxStyle("none");
        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        revealAllCells(newBoard);

    }

    function startGame() {
        if (hasStarted) {
            cashOut();
            return;
        }
        if (betAmount > coins) {
            alert("Insufficient coins");
            return;
        }else if(betAmount <= 0){
            alert("Bet Amount Must be greater than 0");
            return;
        }
         
        setGemOpened(1);
        setProfitAmount(0);
        setGameOver(false);
        updateCoins(-betAmount);

        const initialBoard = createBoard(5, 5, numMines); // Create a 5x5 board with the specified number of mines
        setBoard(initialBoard);
        setHasStarted(true);
        setButtonText("Cashout");
        setProfitBoxStyle("block");
        setProfitAmount(betAmount);
        setShowCashoutBox(false);
    }

    function handleCellClick(row, col) {
        if (gameOver || board[row][col].revealed || !hasStarted) return;

        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        if (newBoard[row][col].mine) {
            setGameOver(true);
            setHasStarted(false);
            setButtonText("Bet");
            setProfitBoxStyle("none");
            revealAllCells(newBoard);
            setBoard(newBoard);
            bombSound.play();
            setProfitAmount(0);
        } else {
            newBoard[row][col].revealed = true;
            setGemOpened(prev => prev + 1);
            calculateProfit(gemOpened + 1, numMines, betAmount);
            setBoard(newBoard);
            gemSound.play();
            if(numMines === (25-gemOpened)) {
                const newBoard = board.map(row => row.map(cell => ({ ...cell })));
                revealAllCells(newBoard);
                cashOut()
            };
        }
    }

    function calculateProfit(gemOpened, numMines, betAmount) {
        if (gemOpened <= 5) {
            setMultiplier(1.2);
        } else if (gemOpened <= 10) {
            setMultiplier(1.5);
        } else if (gemOpened <= 13) {
            setMultiplier(2);
        } else if (gemOpened <= 19) {
            setMultiplier(3);
        } else if (gemOpened <= 23) {
            setMultiplier(5);
        } else if (gemOpened <= 25) {
            setMultiplier(10);
        } 

        profitVar = betAmount * (multiplier + (gemOpened / 25) * numMines);
        const roundedProfitVar = parseFloat(profitVar.toFixed(2));
        setProfitAmount(roundedProfitVar);
    }

    function revealAllCells(board) {
        board.forEach(row => row.forEach(cell => {
            cell.revealed = true;
        }));
    }

    function handleNumMinesChange(event) {
        const newNumMines = parseInt(event.target.value, 10);
        setNumMines(newNumMines);
    }

    function handleBetAmountChange(event) {
        const newBetAmount = parseInt(event.target.value, 10);
        setBetAmount(newBetAmount);
    }

    return (
        <div className="mines-page">
            <h1>Mines Game</h1>
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div
                                key={colIndex}
                                className={`cell ${cell.revealed ? 'revealed' : ''}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {cell.revealed && (cell.mine ? '💣' : '💎')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="options">
                <div className="option">
                    <label>
                        Bet Amount:
                        <input
                            type="number"
                            value={betAmount}
                            min={1}
                            max={1000000}
                            onChange={handleBetAmountChange}
                            step={2}
                        />
                        <button className='betMinMax Max' onClick={()=> {coins>1?setBetAmount(coins):setBetAmount(1)}}>Max</button>
                        <button className='betMinMax Min' onClick={()=> {setBetAmount(1)}}>Min</button>
                    </label>
                    <label>
                        Mines: {numMines}
                        <input
                            className="slider"
                            type="range"
                            min="1"
                            max="24"
                            value={numMines}
                            onChange={handleNumMinesChange}
                            style={{ '--value': `${(numMines) * (100 / 24)}%` }} // Updated inline style
                        />
                    </label>
                    <div className="profitBox" style={{ display: profitBoxStyle }}>
                        <label>
                            Profit Amount:
                            <input
                                type="number"
                                value={profitAmount}
                                readOnly
                            />
                        </label>
                    </div>
                    <button className="start-btn" onClick={startGame}>{buttonText}</button>
                </div>
            </div>
            {gameOver && <div className="game-over">Game Over!</div>}
            {showCashoutBox && (
                <div className="cashout-box">
                    <div className="multiplier">{(profitAmount/betAmount).toFixed(2)}x</div>
                    <div className="profit">${profitAmount.toFixed(2)}</div>
                    <button onClick={() => setShowCashoutBox(false)}>Ok</button>
                </div>
            )}
        </div>
    );
}

export default Mines;
