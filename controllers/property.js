const { Db, MinMax, Store } = require('../lib');
const _ = require('lodash');

const DISTANCE_THRESHOLD = 2;
const DISTANCE_FULL_MATCH = 30;


const get = async (req, res) => {
  const cached = getCached(req);
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

  // Filtering null results
  results = _.without(results, undefined)

  // Caching results
  Store.set(formatKey(req.query), results);
  
  // Return results
  res.send(results);
};


const getCached = (req) => {
  const key = formatKey(req.query);
  return Store.get(key);
}


const formatKey = ({ lat, lng, budgetMin, budgetMax, bathroomMin, bathroomMax, bedroomMin, bedroomMax, offset }) => {
  return `${lat}_${lng}_${budgetMin}_${budgetMax}_${bathroomMin}_${bathroomMax}_${bedroomMin}_${bedroomMax}_${offset}`;
}

const addScore = (result) => {
  if (!result.score) {
    result.score = 0;
  }

  return result;
}

const percentage = (value, percent) => {
  return (Number(value) * percent) / 100;
}

const matchPercentage = (value, valueTwo) => {
  if (value < valueTwo) {
    return (value / valueTwo) * 100;
  }

  return (valueTwo / value) * 100;
}


const scoreMatches = (results, budget, budgetMin, budgetMax, bedroom, bedroomMin, bedroomMax, bathroom, bathroomMin, bathroomMax) => {
  return _.map(results, (result) => {
    // Adding score if does not exists
    result = addScore(result);
    result = scoreDistance(result);
    result = scoreBudget(result, budget, budgetMin, budgetMax);
    result = scoreRoom(result, 'bedrooms', bedroom, bedroomMin, bedroomMax);
    result = scoreRoom(result, 'bathrooms', bathroom, bathroomMin, bathroomMax);
    if (result.score >= 40) {
      return result;
    }
  });
}


const scoreDistance = (result) => {
  if (result.distance < DISTANCE_THRESHOLD) {
    result.score = DISTANCE_FULL_MATCH;
  } else {
    // TODO Change this after getting answer from mail
    result.score = Number(result.score) +  20;
  }

  return result;
}


const scoreBudget = (result, budget, budgetMin, budgetMax) => {
  if (!budget) {
    if (result.price <= budgetMax && result.price >= budgetMin) {
      result.score = Number(result.score) + 30;
    } else {
      result.score = 0;
    }
  } else if (budget) {
    const bPercent = percentage(budget, 10);
    if (result.price >= Number(budget) - bPercent && result.price <= Number(budget) + bPercent) {
      result.score = Number(result.score) + 30;
    } else {
      result.score = 0;
    }
  }

  return result;
}


const scoreRoom = (result, key, room, roomMin, roomMax) => {
  if (!room) {
    if (result[key] >= roomMin && result[key] <= roomMax) {
      result.score = Number(result.score) +  20;
    } else {
      result.score = 0;
    }
  } else {
    let bPercent = matchPercentage(result[key], room);
    result.score = Number(result.score) + percentage(20, bPercent);
  }

  return result;
}

module.exports = {
  get
};