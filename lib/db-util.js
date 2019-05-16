const Db = require('./db');

const DISTANCE = 10;


const search = async (lat, lng, offset) => {

  const fields = ['id', 'lat', 'lng', 'price', 'bathrooms', 'bedrooms', 'status'];
  fields.push(`(
    6371 * acos (
      cos ( radians( ? ) )
      * cos( radians( lat ) )
      * cos( radians( lng ) - radians( ? ) )
      + sin ( radians( ? ) )
      * sin( radians( lat ) )
    )
  ) AS distance`);

  // Formatting query
  const query = `SELECT ${fields.join(', ')} FROM properties WHERE status = ? HAVING distance < ${DISTANCE} ORDER BY distance LIMIT ${offset}, 100`;
  const values =  [lat, lng, lat, 1];

  return await Db.client().queryAsync(query, values);
}


module.exports = {
  search
};