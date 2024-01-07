const { Client, GatewayIntentBits } = require('discord.js'); // Import GatewayIntentBits from 'discord.js'
const axios = require('axios');
const fs = require('fs');
const bot = require('./index'); // Import your bot script

const PREFIX = '!';

describe('Bot Integration Tests', () => {
    let client;

    beforeAll(() => {
        client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
        });
        bot(client); // Pass your client instance to your bot script
    });

    afterAll(() => {
        client.destroy();
    });

    it('should respond to !btc command with Bitcoin price', async (done) => {
        const message = {
            content: `${PREFIX}btc`,
            channel: {
                send: (response) => {
                    expect(response).toContain('The current price of Bitcoin is: ');
                    done();
                },
            },
        };

        // Simulate a 'messageCreate' event
        client.emit('messageCreate', message);
    });
});
