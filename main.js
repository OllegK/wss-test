'use strict';

require('dotenv').config();

const WebSocket = require('ws');

// const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=ltcusdt@ticker/ltcusdt@kline_1m');

ws.on('open', function open() {
    console.log('open');
});

ws.on('message', function incoming(data) {
  console.log(data);
});





