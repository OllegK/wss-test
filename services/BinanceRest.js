'use strict';

const API_KEY = process.env.API_KEY;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

const axios = require('axios');
axios.defaults.baseURL = 'https://api.binance.com/api/';

const timeout = ms => new Promise(res => setTimeout(res, ms));

class BinanceRest {

  // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md

  constructor() {
  }

}

module.exports = BinanceRest;
