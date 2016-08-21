// dependencies
const config = require('./../helpers/config');
const peegee = require('./../lib');

const pool = peegee(config);

exports.up = (next) => {

  pool().then(([client]) => {

    client['create-table']({
      table: 'places',
      definition: {
        id: { type: 'serial', primaryKey: true },
        book_id: { type: 'int', references: { table: 'books', column: 'id' } },
        verse: { type: 'text' },
        biblical_name: { type: 'text' },
        present_name: { type: 'text' },
        region: { type: 'text' },
        country: { type: 'text' },
      },
    }).then(() => next());

  });

};

exports.down = (next) => {
  next();
};
