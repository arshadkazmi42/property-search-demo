const { Constants, Db, MinMax, Store, Score, Util } = require('../lib');
const _ = require('lodash');


const get = async (req, res) => {
  const cached = Store.get(Util.formatKey(req.query));
  if (cached) {
    console.log('RETURNING CACHED RESULTS');
    return res.send(cached);
  }

  let { lat, lng, budgetMin, budgetMax, bathroomMin, bathroomMax, bedroomMin, bedroomMax, offset } = req.query;
  if (!offset) {
    offset = 0;
  }

  // Checking if min/max any one is missing
  const budget = MinMax.get(budgetMin, budgetMax);
  const bathroom = MinMax.get(bathroomMin, bathroomMax);
  const bedroom = MinMax.get(bedroomMin, bedroomMax);

  // Fetching results from database
  let results = await Db.search(lat, lng, offset);

  // Scoring results and picking good matches
  results = scoreMatches(
    results, 
    budget, budgetMin, budgetMax, 
    bedroom, bedroomMin, bedroomMax, 
    bathroom, bathroomMin, bathroomMax
  );

  // Sorting results by score
  results = _.orderBy(results, ['score'], ['desc']);

  // Filtering null results
  results = _.without(results, undefined)

  // Caching results
  Store.set(Util.formatKey(req.query), results);
  
  // Return results
  res.send(results);
};


const scoreMatches = (results, budget, budgetMin, budgetMax, bedroom, bedroomMin, bedroomMax, bathroom, bathroomMin, bathroomMax) => {
  return _.map(results, (result) => {
    // Adding score if does not exists
    result = Score.addScore(result);
    
    result = Score.distance(result);
    result = Score.budget(result, budget, budgetMin, budgetMax);
    result = Score.room(result, 'bedrooms', bedroom, bedroomMin, bedroomMax);
    result = Score.room(result, 'bathrooms', bathroom, bathroomMin, bathroomMax);
    if (result.score >= Constants.GOOD_MATCH_THRESHOLD) {
      return result;
    }
  });
}

module.exports = {
  get
};