const SqlClient = require('@arshadkazmi42/my-no-sql');
const config = require('../config');


const client = () => {
  const client = new SqlClient(config);
  client.connect();
  return client;
}


module.exports = {
  client
};