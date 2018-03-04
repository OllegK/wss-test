'use strict';

require('dotenv').config();

const BinanceRest = require('./services/BinanceRest');
const BinanceWss = require('./services/BinanceWss');

(async function () {

  const print = (msg) => console.log(`RECEIVED: ${JSON.stringify(msg)}`);

  let listenKey = await (new BinanceRest()).createListenKey();
  await (new BinanceWss(listenKey, print)).start(print);

})();
