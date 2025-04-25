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
  const [gameStatus, setGameStatus] = useState('');
  const [playerStood, setPlayerStood] = useState(false);
  const [betAmount, setBetAmount] = useState('1');
  const [betLocked, setBetLocked] = useState(false);
  const [isDoubling, setIsDoubling] = useState(false);

  const startGame = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0 || bet > coins) {
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
    setIsDoubling(false);
    setBetLocked(true);
    updateCoins(-bet);

    if(calculateHandValue(playerStartingHand) === 21) {
      setGameStatus(`Blackjack! Player wins! <br/> <span class='win'>+ $${bet * 2.5}</span>`);
      updateCoins(bet * 2.5); // Return the bet as winnings
    }
    if(calculateHandValue(dealerStartingHand) === 21) {
      setGameStatus(`Dealer has blackjack! Dealer wins! <br/> <span class='lose'>- $${bet}</span>`);
    }
  };

  const hit = () => {
    if (gameStatus !== 'Game in Progress') return;
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand, dealCard(newDeck)];
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    if (calculateHandValue(newPlayerHand) > 21) {
      setGameStatus(`Player busts! Dealer wins! <br/> <span class='lose'>- $${betAmount}</span>`);
    }
  };

  const doubleHIT = async() => {
    if (gameStatus !== 'Game in Progress') return;
  
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || coins < bet) {
      setGameStatus('Not enough coins to double down!');
      return;
    }
  
    // Deduct the additional bet amount
    updateCoins(-bet);
  
    // Deal one card to the player
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand, dealCard(newDeck)];
  
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
  
    // Update isDoubling and proceed to dealer's turn
    setIsDoubling(true);
  
    // Check if the player busts
    const playerValue = calculateHandValue(newPlayerHand);
    if (playerValue > 21) {
      setGameStatus(`Player busts! Dealer wins! <span class='lose'>- $${bet * 2}</span>`);
    } else {
     
      setPlayerStood(true);
      let newDeck = [...deck];
      let newDealerHand = [...dealerHand];
      // Dealer draws cards until the hand value is at least 17
      while (calculateHandValue(newDealerHand) < 17) {
        newDealerHand.push(dealCard(newDeck));
        setDealerHand([...newDealerHand]);
        setDeck(newDeck);
        await new Promise(res => setTimeout(res, 1000)); // Simulate delay

      }
      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(newDealerHand);
      const bet =  parseFloat(betAmount) * 2 ;
    
      if (dealerValue > 21 || playerValue > dealerValue) {
        // Player wins, update coins with winnings
        updateCoins(bet * 2); // Return the doubled bet as winnings
        setGameStatus(`Player wins! <span class='win'>+ $${bet * 2}</span>`);
      } else if (playerValue < dealerValue) {
        // Dealer wins, no additional coins are returned
        setGameStatus(`Dealer wins! <span class='lose'>- $${bet}</span>`);
      } else {
        // Draw, return the original bet
        updateCoins(bet);
        setGameStatus(`Draw! <span class='win'>+ $0</span>`);
      }


    }
  };
  
  const stand = async () => {
    setPlayerStood(true);
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];
    // Dealer draws cards until the hand value is at least 17
    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(dealCard(newDeck));
      setDealerHand([...newDealerHand]);
      setDeck(newDeck);
      await new Promise(res => setTimeout(res, 1000)); // Simulate delay
    }
  
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(newDealerHand);
    const bet = isDoubling ? parseFloat(betAmount) * 2 : parseFloat(betAmount);
  
    if (dealerValue > 21 || playerValue > dealerValue) {
      // Player wins, update coins with winnings
      updateCoins(bet * 2); // Return the doubled bet as winnings
      setGameStatus(`Player wins! <span class='win'>+ $${bet * 2}</span>`);
    } else if (playerValue < dealerValue) {
      // Dealer wins, no additional coins are returned
      setGameStatus(`Dealer wins! <span class='lose'>- $${bet}</span>`);
    } else {
      // Draw, return the original bet
      updateCoins(bet);
      setGameStatus(`Draw! <span class='win'>+ $0</span>`);
    }
  };

  const resetGame = () => {
    setDeck(initializeDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('');
    setBetLocked(false);
    setPlayerStood(false);
    setIsDoubling(false);
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
      <center><h1 className='title'>Blackjack</h1></center>
      <br /><br /><br />

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

        <div className="bet-section">
          <label>Bet Amount:
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter amount"
              className="bet-input"
              disabled={betLocked}
              step={1}
              style={{ width: '150px' }}
            />
            <br /><br />
            {gameStatus !== 'Game in Progress' && (
              <>
                <button className='half' onClick={() => setBetAmount((parseFloat(betAmount) * 0.5).toFixed(2))}>1/2</button>
                <button className='double' onClick={() => setBetAmount((parseFloat(betAmount) * 2).toFixed(2))}>2x</button>
                <button className='Min' onClick={() => setBetAmount(1)}>Min</button>
                <button className='Max' onClick={() => setBetAmount(coins > 1 ? coins : 1)}>Max</button>
              </>
            )}
          </label>
          <br />
          {!betLocked && <button className='startBTN' disabled={coins < parseFloat(betAmount)} onClick={startGame}>Bet</button>}
          {betLocked && (
            <>
              {gameStatus === 'Game in Progress' && (
                <>
                  <button onClick={hit}>Hit</button>
                  <button onClick={stand}>Stand</button><br />
                  <button disabled={coins < parseFloat(betAmount)} onClick={doubleHIT}>Double</button>
                </>
              )}
              <p dangerouslySetInnerHTML={{ __html: gameStatus }}></p>
              {gameStatus !== 'Game in Progress' && (
                <button disabled={coins < parseFloat(betAmount)} onClick={resetGame}>Play Again</button>
              )}
            </>
          )}
        </div>

        <div className={`hand ${gameStatus.includes('Dealer wins') ? 'winner' : ''}`}>
          <h2>Dealer's Hand</h2>
          <div className="cards">
            {dealerHand.map((card, index) => (
              <div key={index} className="card">
                <div className="rank">{card.rank}</div>
                <div className="suit">{getSuitEmoji(card.suit)}</div>
              </div>
            ))}
          </div>
          <p>Value: {playerStood ? calculateHandValue(dealerHand) : calculateHandValue(dealerHand.slice(0, 1))}</p>
        </div>
      </div>
    </div>
  );
}

export default BlackJack;
