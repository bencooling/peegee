// dependencies
const { test } = require('tap');
const peegee = require('./../lib');
const config = require('./../helpers/config');

const table = 'books';
const pool = peegee(config);
// client is persisted until done() is called.
const persistedPool = peegee(config, true);

test('pool returns a client', t => {
  pool().then(([client]) => {
    client.select({ table: 'books' })
        .then(res => {
          t.true(res.command === 'SELECT');
          t.pass();
          t.end();
        });
  });
});

test('manually return client to pool to perform transaction', t => {

  persistedPool().then(([client, done]) => {
    client.expression({ expression: 'begin' })
      .then(client.insert({ table, values: { name: 'Ben Cooling' } }))
      .then(client.expression({ expression: 'rollback' }))
      .then(client.select({ table: 'books' }))
      .then(console.log)
      .then(() => {
        console.log('waiting 5 seconds before returning client to pool');
        setTimeout(() => {
          done();
          t.pass();
          t.end();
        }, 5000);
      });
  });
});
