'use strict';

require('dotenv').config();

const BinanceRest = require('./services/BinanceRest');
const BinanceWss = require('./services/BinanceWss');
const telegramBot = require('./services/telegramBot');

(async function () {

  const print = async (msg) => {
    if ('outboundAccountInfo' === msg.e) {
      await telegramBot.sendMessage('Update account info is received');
      console.log(`RECEIVED: ${JSON.stringify(msg.B)}`);
    }
  };

  let listenKey = await (new BinanceRest()).createListenKey();
  await (new BinanceWss(listenKey, print)).start(print);

})();
