
var config = {
  user: 'maxroach',
  database: 'TEST',
  host: 'localhost',
  port: '26257',
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

module.exports = config;
