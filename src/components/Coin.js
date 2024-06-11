import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CoinPurchaseModal from './CoinPurchaseModal';
import './Coin.css';

function Coin({ coins, points, updateCoins, updatePoints }) {
    const [walletAddress, setWalletAddress] = useState('');
    const [ethAmount, setEthAmount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Add state for modal
    const [walletConnectionText, setWalletConnectionText] = useState("Connect Wallet");

    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                const data = await response.json();
                const ethPriceInUsd = data.ethereum.usd;
                setEthAmount(1 / ethPriceInUsd); // Calculate ETH amount equivalent to $1
            } catch (error) {
                console.error('Error fetching ETH price:', error);
            }
        };

        fetchEthPrice();
    }, []);

    useEffect(() => {
        // Event listener for account changes
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                setWalletAddress(accounts[0]);
                setWalletConnectionText(accounts[0].substring(0, 4) + "..." + accounts[0].substring(accounts[0].length - 4));
                document.getElementById("connectBTN").disabled = true;
                document.getElementById("depoBTN").style.display = "block";
                document.getElementById("disconnectBTN").style.display = "block";
            }
        };

        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                setWalletAddress(accounts[0]);
                setWalletConnectionText(accounts[0].substring(0, 4) + "..." + accounts[0].substring(accounts[0].length - 4));
                document.getElementById("connectBTN").disabled = true;
                document.getElementById("depoBTN").style.display = "block";
                document.getElementById("disconnectBTN").style.display = "block";
            } catch (error) {
                console.error('User denied account access or error connecting:', error);
                alert('Error connecting to wallet.');
            }
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    };

    const disconnectWallet = () => {
        setWalletAddress('');
        setWalletConnectionText("Connect Wallet");
        document.getElementById("connectBTN").disabled = false;
        document.getElementById("depoBTN").style.display = "none";
        document.getElementById("disconnectBTN").style.display = "none";
    };

    const handleBuyCoins = async () => {
        if (!walletAddress) {
            await connectWallet();
        }
        payOneDollar();
    };

    const payOneDollar = async () => {
        if (walletAddress) {
            const web3 = new Web3(window.ethereum);
            const ethAmountInWei = web3.utils.toWei(ethAmount.toString(), 'ether');
            console.log('ETH Amount in Wei:', ethAmountInWei);

            try {
                const transaction = await web3.eth.sendTransaction({
                    from: walletAddress,
                    to: '0xFAD1F88fE055e3670439e9c04AB2D3D768f6b891', // Replace with your recipient address
                    value: ethAmountInWei,
                    gas: 30000 // Increase the gas limit
                });

                console.log('Transaction successful:', transaction);
                alert('Payment successful! You have received 10,000 coins.');
                updateCoins(10000); // Credit user with coins

                // Save the coin balance to the database
                const response = await fetch('http://localhost:5000/api/save-coins', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        walletAddress,
                        coins: 10000,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save coins to the database.');
                }

                setIsModalOpen(false); // Close the modal
            } catch (error) {
                console.error('Transaction failed:', error);
                alert('Payment failed!');
            }
        } else {
            alert('Please connect your wallet first.');
        }
    };

    return (
        <div className="holder">
            <div className="points container">
                <img src={"/images/mines.png"} alt="Points" className="image" />
                <span>{points.toFixed(2)}</span>
            </div>
            
            <div className="coin container">
                <img src={"/images/coin.png"} alt="Coin" className="image" />
                <span>{coins.toFixed(2)}</span>
            </div>

            <button id='depoBTN' className='Deposit btns container hidden' onClick={() => setIsModalOpen(true)}>Deposit</button>
            <button className='Connect btns container' id='connectBTN' onClick={connectWallet}>{walletConnectionText}</button>
            <button className='Disconnect btns container hidden' id='disconnectBTN' onClick={disconnectWallet}>Disconnect Wallet</button>
            {/* <button>Buy Coins</button> */}

            {isModalOpen && (
                <CoinPurchaseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onBuyCoins={handleBuyCoins}
                />
            )}
        </div>
    );
}

export default Coin;
