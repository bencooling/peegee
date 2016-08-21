module.exports = ({ pg, mongosql, debug }) => {

  const createClient = (persistClient) => (client, done) => new Proxy({}, {
    get(target, prop) {
      // overloaded method: select, insert, function, create-table ...
      return (args) => {
        // tableless types whose method is also the type
        const types = ['create-view', 'function', 'expression'];
        const computedArgs = (types.indexOf(prop) > -1) ?
          { table: prop } :
          { type: prop };
        // Construct sql options
        const options = Object.assign({}, computedArgs, args);
        const { text, values } = mongosql.sql(options).toQuery();
        // print to stdout in debug mode
        debug({ text, values });
        return new Promise((resolve, reject) =>
          client.query(text, values, (err, result) => {
            console.log('result', result);
            if (!persistClient) {
              done(); // return to pool
            }
            console.log('err', err);
            return (err) ? reject(err) : resolve(result);
          }));
      };
    },
  });

  // expose peegee
  return (config, persistClient = false) => () => {
    const c = createClient(persistClient);
    return new Promise((resolve, reject) => {
      const pool = new pg.Pool(config);
      pool.connect((err, client, done) => {
        const proxyObj = c(client, done);
        return (err) ? reject(err) : resolve([proxyObj, done]);
      });
    });
  };
};
