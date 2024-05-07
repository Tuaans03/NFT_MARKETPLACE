const config = require('../config/config');
const cron = require('node-cron');
const {Web3} = require('web3');
const web3 = new Web3(config.onchain.network_rpc_url);
const contractJson = require('')