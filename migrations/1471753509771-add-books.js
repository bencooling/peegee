// dependencies
const config = require('./../helpers/config');
const peegee = require('./../lib');

const pool = peegee(config);

exports.up = (next) => {

  pool().then(([client]) => {

    client['create-table']({
      table: 'books',
      definition: {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'text' },
      },
    }).then(() => next());

  });

};

exports.down = (next) => {
  next();
};
