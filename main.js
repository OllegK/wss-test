'use strict';

require('dotenv').config();

const BinanceRest = require('./services/BinanceRest');
const BinanceWss = require('./services/BinanceWss');
const telegramBot = require('./services/telegramBot');

const events = require('events');
const eventEmitter = new events.EventEmitter();
eventEmitter.on('pingCount', () => {
  console.log('ping count is received......................')
});

(async function () {

  const print = async (msg) => {
    if ('outboundAccountInfo' === msg.e) {
      let arr = msg.B
        .filter(el => (el.f > 0 || el.l > 0))
        .map(el => `${el.a}:${el.f}${el.l > 0 ? '/' + el.l : ''}`)
        .join('|');
      await telegramBot.sendMessage(`Update account info is received - ${arr}`);
      console.log(`RECEIVED: ${arr}`);
    } else if ('executionReport' === msg.e) {
      await telegramBot.sendMessage(JSON.stringify(msg));
      console.log(JSON.stringify(msg));
    }
  };

  let listenKey = await (new BinanceRest()).createListenKey();
  await (new BinanceWss(listenKey, eventEmitter)).start(print);

})();
