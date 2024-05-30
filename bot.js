const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = '7118217245:AAEeaqFxxSBxNdX5i8CHtpEAZIX4lcYxHPM';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.chat.invite_link;
    console.log(`Received message from user ${userId}, chat ${chatId}: ${msg.text}`);


    fetch('http://localhost:5000/receive-data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({userId}),
})
.then(response => {
    if (response.ok) {
        console.log('Data sent successfully');
    } else {
        console.error('Failed to send data:', response.status);
    }
})
.catch(error => {
    console.error('Error sending data:', error);
});
});
