'use strict';

const axios = require('axios');

module.exports = new class TelegramBot {

  constructor() {
    this.bot = process.env.BOT;
    this.chatId = process.env.CHAT_ID;
  }

  async sendMessage(msg) {
    try {
      await axios.get(`https://api.telegram.org/bot${this.bot}/sendMessage`, {
        params: {
          chat_id: this.chatId,
          parse_mode: 'html',
          text: msg,
        },
      });
    } catch (err) {
      console.log('Error sending telegram message');
      console.log(err.response ? err.response.data : err);
    }
  }

};
