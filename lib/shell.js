module.exports = require('./core')({
  pg: require('pg'),
  mongosql: require('mongo-sql'),
  debug: require('debug')('peegee'),
});
