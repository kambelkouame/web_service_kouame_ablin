// check env.
const loggers = require('../logger/logger');

var env = process.env.NODE_ENV || 'preproduction'; //'prodcopie';
// fetch env. config
var config = require('./config.json');
var envConfig = config[env];
// add env. config values to process.env

loggers.warn('DEFAULT ENV:' + env);
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);