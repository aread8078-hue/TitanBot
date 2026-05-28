const { 
  Client, 
  GatewayIntentBits 
} = require('discord.js');

const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = 'PUT_BOT_TOKEN_HERE';
const OPENAI_API_KEY = 'PUT_OPENAI_API_KEY_HERE';

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  // الامر
  if (!message.content.startsWith('!ai')) return;

  const question = message.content.slice(3).trim();

  if (!question) {
    return message.reply('اكتب سؤالك بعد !ai');
  }

  try {

    await message.channel.sendTyping();

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful Discord AI bot.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply =
      response.data.choices[0].message.content;

    message.reply(aiReply);

  } catch (error) {

    console.log(error);

    message.reply('حصل خطأ في الذكاء الاصطناعي.');
  }
});

client.login(TOKEN);
