// src/api.js

export const getUser = async (walletAddress) => {
    try {
        const response = await fetch(`/api/users/${walletAddress}`);
        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

export const createUserOrUpdateCoins = async (walletAddress, coins) => {
    try {
        const response = await fetch(`/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ walletAddress, coins })
        });
        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error updating user coins:', error);
        return null;
    }
};
