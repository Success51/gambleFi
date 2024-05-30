// src/components/Friends.js

import React, { useState, useEffect } from 'react';
import './Friends.css';

function Friends() {
    const [inviteLink, setInviteLink] = useState('');

    // Fetch the invite link from the backend when the component mounts
    useEffect(() => {
        const fetchInviteLink = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-invite-link', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setInviteLink(data.inviteLink);
                } else {
                    console.error('Failed to fetch invite link');
                }
            } catch (error) {
                console.error('Error fetching invite link:', error);
            }
        };

        fetchInviteLink();
    }, []);

    // Copy the invite link to the clipboard
    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink)
            .then(() => {
                alert('Invite link copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying invite link:', err);
            });
    };

    return (
        <div className="friends-page">
            <h1>Invite Your Friends</h1>
            {inviteLink ? (
                <div className="invite-section">
                    <p>Share this link with your friends to invite them:</p>
                    <input type="text" value={inviteLink} readOnly />
                    <button onClick={handleCopyLink}>Copy Link</button>
                </div>
            ) : (
                <p>Loading your invite link...</p>
            )}
        </div>
    );
}

export default Friends;
