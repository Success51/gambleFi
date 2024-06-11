// src/components/WalletConnect.js

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CoinPurchaseModal from './CoinPurchaseModal';
import './Coin.css'; // Updated import statement to match the file name


const WalletConnect = ({ coins, updateCoins  }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [ethAmount, setEthAmount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                setWalletAddress(accounts[0]);
                console.log('Connected account:', accounts[0]);
            } catch (error) {
                console.error('User denied account access or error connecting:', error);
                alert('Error connecting to wallet.');
            }
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
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

            try {
                const transaction = await web3.eth.sendTransaction({
                    from: walletAddress,
                    to: '0xFAD1F88fE055e3670439e9c04AB2D3D768f6b891', // Replace with your recipient address
                    value: ethAmountInWei
                });

                console.log('Transaction successful:', transaction);
                alert('Payment successful! You have received 10,000 coins.');
                updateCoins(10000); // Credit user with coins

                // Save the coin balance to the database
                await fetch('http://localhost:5000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        walletAddress,
                        coins: 10000,
                    }),
                });

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
        <div>
            <div className="Connect container">
                <button  onClick={connectWallet} >Connect Wallet</button>
            </div>

            <button onClick={connectWallet}>Connect Wallet</button>
            {walletAddress && <p>Connected Wallet: {walletAddress.substring(0, 4) +"..."+ walletAddress.substring(walletAddress.length-4 ,walletAddress.length)}</p>}
            <button onClick={() => setIsModalOpen(true)}>Shop</button>
            <p>Coins: {coins}</p>
            <CoinPurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onBuyCoins={handleBuyCoins}
            />
        </div>
    );
};

export default WalletConnect;
