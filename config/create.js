const env = process.env.NODE_ENV || 'development';
const getConfig = require('./config').getConfig;
const fs = require('fs');
const path = require('path');
const config = getConfig(env);

/**
 * Function for create new config file.
 */
const saveConfigFile = (path, config) => {
  
};

const configPath =  path.join(__dirname, '../config.json');
saveConfigFile(configPath, config);
