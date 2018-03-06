'use strict';

require('dotenv').config();

const BinanceRest = require('./services/BinanceRest');
const BinanceWss = require('./services/BinanceWss');
const telegramBot = require('./services/telegramBot');

(async function () {

  const print = async (msg) => {
    if ('outboundAccountInfo' === msg.e) {
      let arr = msg.B.filter(el => (el.f > 0 || el.l > 0));
      await telegramBot.sendMessage('Update account info is received - ' + JSON.stringify(arr));
      console.log(`RECEIVED: ${JSON.stringify(arr)}`);
    } else if ('executionReport' === msg.e) {
      await telegramBot.sendMessage(JSON.stringify(msg));
      console.log(JSON.stringify(msg));
    }
  };

  let listenKey = await (new BinanceRest()).createListenKey();
  await (new BinanceWss(listenKey, print)).start(print);

})();
