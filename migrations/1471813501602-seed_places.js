// dependencies
const config = require('./../helpers/config');
const peegee = require('./../lib');
const wikitable = require('wikitable');

const pool = peegee(config);
const url = segment => `https://en.wikipedia.org/wiki/${segment}`;

exports.up = (next) => {

  pool().then(([client]) => {

    wikitable({ url: url('List_of_modern_names_for_biblical_place_names') })
      .then(data =>
        data[0].map(place => Object.keys(place).reduce((obj, key) => {
          if (key !== 'Country Flag') {
            let k = (key === 'Mentioned in') ? 'verse' : key;
            k = (key === 'Province/Region') ? 'region' : k;
            k = (key === 'Country Name') ? 'country' : k;
            obj[k.toLowerCase().replace(/\s/g, '_')] = place[key];
          }
          return obj;
        }, {})))
      .then(values => client.insert({ table: 'places', values }))
      .then(() => next());

  });

};

exports.down = (next) => {
  next();
};
