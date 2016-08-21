// dependencies
const config = require('./../helpers/config');
const peegee = require('./../lib');
const wikitable = require('wikitable');

const pool = peegee(config);
const url = segment => `https://en.wikipedia.org/wiki/${segment}`;

exports.up = (next) => {

  pool().then(([client]) => {

    wikitable({ url: url('List_of_books_of_the_King_James_Version') })
      .then(data => {
        /* eslint no-unused-vars:0 */
        const [oldTestament, apocrypha, newTestament] = data;
        return oldTestament.concat(newTestament)
          .map(book => ({ name: book['King James Bible'] }));
      })
      .then(values => client.insert({ table: 'books', values }))
      .then(() => next());

  });

};

exports.down = (next) => {
  next();
};
