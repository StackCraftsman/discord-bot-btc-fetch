const readline = require('readline');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const PREFIX = '!';

client.on('ready', () => {
    console.log('Bot is ready');
    startCommandInput(); // Start listening for commands in the terminal
});

client.on('messageCreate', async (message) => {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'btc') {
        try {
            const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
            const btcPrice = response.data.bpi.USD.rate;
            message.channel.send(`The current price of Bitcoin is: ${btcPrice}`);
        } catch (error) {
            console.error(error);
            message.channel.send('Error retrieving Bitcoin price.');
        }
    }
});

// Read the bot token from config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const token = config.token;

client.login(token);

function startCommandInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const listenForCommand = () => {
        rl.question('Enter a command: ', (command) => {
            if (command === 'exit') {
                rl.close();
                process.exit(0);
                return;
            }

            const message = {
                content: command,
                channel: {
                    send: (response) => {
                        console.log(response);
                        listenForCommand(); 
                    },
                },
            };

            client.emit('messageCreate', message);
        });
    };

    listenForCommand(); // Start listening for the first command
}
