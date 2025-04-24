import React, { useState, useEffect } from 'react';
import './BlackJack.css';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const initializeDeck = () => {
  let deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ suit, rank });
    });
  });
  return shuffle(deck);
};

const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const dealCard = (deck) => deck.pop();

const cardValue = (card) => {
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return 11;
  return parseInt(card.rank, 10);
};

const calculateHandValue = (hand) => {
  let value = 0;
  let aceCount = 0;
  hand.forEach(card => {
    value += cardValue(card);
    if (card.rank === 'A') aceCount++;
  });
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
};

const getSuitEmoji = (suit) => {
  const emojis = {
    Hearts: '♥️',
    Diamonds: '♦️',
    Clubs: '♣️',
    Spades: '♠️'
  };
  return emojis[suit] || '';
};

function BlackJack({ coins, points, updateCoins, updatePoints }) {
  const [deck, setDeck] = useState(initializeDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('Game in Progress');
  const [playerStood, setPlayerStood] = useState(false);
  const [betAmount, setBetAmount] = useState('1');
  const [betLocked, setBetLocked] = useState(false);

  const startGame = () => {
    const bet = parseInt(betAmount);
    if ( bet < 0 || bet > coins) {
      alert(`Enter a valid bet amount. You have ${coins} coins.`);
      return;
    }

    const newDeck = initializeDeck();
    const playerStartingHand = [dealCard(newDeck), dealCard(newDeck)];
    const dealerStartingHand = [dealCard(newDeck), dealCard(newDeck)];

    setDeck(newDeck);
    setPlayerHand(playerStartingHand);
    setDealerHand(dealerStartingHand);
    setGameStatus('Game in Progress');
    setPlayerStood(false);
    setBetLocked(true);
    updateCoins(-bet);
  };

  const hit = () => {
    if (gameStatus !== 'Game in Progress') return;
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand, dealCard(newDeck)];
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    if (calculateHandValue(newPlayerHand) > 21) {
      setGameStatus('Player busts! Dealer wins.');
    }
  };

  const stand = async () => {
    if (gameStatus !== 'Game in Progress') return;
    setPlayerStood(true);

    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    const drawCardWithDelay = async () => {
      while (calculateHandValue(newDealerHand) < 17) {
        newDealerHand.push(dealCard(newDeck));
        setDealerHand([...newDealerHand]);
        setDeck(newDeck);
        await new Promise(res => setTimeout(res, 1000));
      }
    };

    await drawCardWithDelay();

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(newDealerHand);

    if (dealerValue > 21 || playerValue > dealerValue) {
      setGameStatus('Player wins!');
      updateCoins(parseInt(betAmount) * 2);
    } else if (playerValue < dealerValue) {
      setGameStatus('Dealer wins!');
    } else {
      setGameStatus('It\'s a tie!');
      updateCoins(parseInt(betAmount)); // Return bet
    }
  };

  const resetGame = () => {
    setDeck(initializeDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('Game in Progress');
    setBetLocked(false);
    setPlayerStood(false);
  };

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.card').forEach(card => {
        card.classList.add('dealt');
      });
    }, 100);
  }, [playerHand, dealerHand]);

  return (
    <div className='BlackJackPage'>
      <h1>Blackjack</h1>
      <br/>
      <br/>
      <br/>

      <div className="hands">
        <div className={`hand ${gameStatus.includes('Player wins') ? 'winner' : ''}`}>
          <h2>Player's Hand</h2>
          <div className="cards">
            {playerHand.map((card, index) => (
              <div key={index} className="card">
                <div className="rank">{card.rank}</div>
                <div className="suit">{getSuitEmoji(card.suit)}</div>
              </div>
            ))}
          </div>
          <p>Value: {calculateHandValue(playerHand)}</p>
        </div>

        {/* Place Bet Input and Buttons Between the Hands */}
        <div className="bet-section">
          <label>Bet Amount:
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="Enter amount"
            className="bet-input"
            disabled={betLocked}
            style={{ width: '150px' }} // Making input width shorter
          />
          <br/>
          <br/>
          {gameStatus == 'Game in Progress' && (
          <>
                <button className='half' onClick={()=> {setBetAmount(betAmount*0.5)}}>1/2</button>
                <button className='double' onClick={()=> {setBetAmount(betAmount*2)}}>2x</button>
                <button className='Min' onClick={()=> {setBetAmount(1)}}>Min</button>
                <button className='Max' onClick={()=> {coins>1?setBetAmount(coins):setBetAmount(1)}}>Max</button>
          </>)}
            </label><br/>

          {!betLocked && <button className='startBTN' onClick={startGame}>Start Game</button>}
          {betLocked && (
            <>
              <button onClick={hit} disabled={gameStatus !== 'Game in Progress'}>Hit</button>
              <button onClick={stand} disabled={gameStatus !== 'Game in Progress'}>Stand</button>

      <p>{gameStatus}</p>

{gameStatus !== 'Game in Progress' && (
  <button onClick={resetGame}>Restart Game</button>
)}
            </>
              
          )}
        </div>

        <div className={`hand ${gameStatus.includes('Dealer wins') ? 'winner' : ''}`}>
          <h2>Dealer's Hand</h2>
          <div className="cards">
            {dealerHand.map((card, index) => {
              return (
                <div key={index} className="card">
                  <div className="rank">{card.rank}</div>
                  <div className="suit">{getSuitEmoji(card.suit)}</div>
                </div>
              );
            })}
          </div>
          <p>Value: {playerStood ? calculateHandValue(dealerHand) : calculateHandValue(dealerHand.slice(0, 1))}</p>
        </div>
      </div>

    </div>
  );
}

export default BlackJack;
