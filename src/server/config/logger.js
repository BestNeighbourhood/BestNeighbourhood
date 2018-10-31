const winston = require('winston');
const path = require('path');

const transports = [];
let level;

if (process.env.NODE_ENV === 'production') {
  transports.push(new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/production.log'),
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: false,
  }));

  // max log level displayed
  level = 'info';
} else {
  transports.push(new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/development.log'),
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: false,
  }));

  transports.push(new winston.transports.Console({
    prettyPrint: true,
    humanReadableUnhandledException: true,
    colorize: true,
    handleExceptions: true,
  }));

  // max log level displayed
  level = 'debug';
}

const logger = new (winston.Logger)({
  transports,
  levels: {
    error: 0, warn: 1, info: 2, verbose: 3, debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'magenta',
  },
  level,
});

logger.debug('Initialized Logger');

module.exports = logger;
