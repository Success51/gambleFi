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

const dealCard = (deck) => {
  return deck.pop();
};

const cardValue = (card) => {
  if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') {
    return 10;
  } else if (card.rank === 'A') {
    return 11;
  } else {
    return parseInt(card.rank, 10);
  }
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
  switch (suit) {
    case 'Hearts':
      return '♥️';
    case 'Diamonds':
      return '♦️';
    case 'Clubs':
      return '♣️';
    case 'Spades':
      return '♠️';
    default:
      return '';
  }
};

function BlackJack() {
  const [deck, setDeck] = useState(initializeDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('Game in Progress');
  const [playerStood, setPlayerStood] = useState(false);

  const startGame = () => {
    const newDeck = initializeDeck();
    const playerStartingHand = [dealCard(newDeck), dealCard(newDeck)];
    const dealerStartingHand = [dealCard(newDeck), dealCard(newDeck)];
    setPlayerHand(playerStartingHand);
    setDealerHand(dealerStartingHand);
    setDeck(newDeck);
    setGameStatus('Game in Progress');
    setPlayerStood(false);
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
        setDealerHand([...newDealerHand]); // Update dealer hand after each card is dealt
        setDeck(newDeck);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before dealing the next card
      }
    };
  
    await drawCardWithDelay();
  
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(newDealerHand);
  
    if (dealerValue > 21 || playerValue > dealerValue) {
      setGameStatus('Player wins!');
    } else if (playerValue < dealerValue) {
      setGameStatus('Dealer wins!');
    } else {
      setGameStatus('It\'s a tie!');
    }
  };
  

  useEffect(() => {
    // Add animation class after initial render
    setTimeout(() => {
      document.querySelectorAll('.card').forEach(card => {
        card.classList.add('dealt');
      });
    }, 0);
  }, [playerHand, dealerHand]);


  return (
    <div className='BlackJackPage'>
      <h1>Blackjack</h1>
      <button onClick={startGame}>Start Game</button>
      <div className="hands">
        <div className="hand">
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
        <div className="hand">
          <h2>Dealer's Hand</h2>
          <div className="cards">
            {dealerHand.map((card, index) => {
              if (index === 1 && !playerStood) {
                return (
                  <div key={index} className="card hidden">
                    ?
                  </div>
                );
              }
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
      <p>{gameStatus}</p>
      <button onClick={hit}>Hit</button>
      <button onClick={stand}>Stand</button>
    </div>
  );
}

export default BlackJack;
