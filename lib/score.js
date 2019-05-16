const Percentage = require('./percentage');
const Constants = require('./constants');


const addScore = (result) => {
  if (!result.score) {
    result.score = 0;
  }

  return result;
}


// Distance score calcultion.
// If distance is less than threshold its full match
const distance = (result) => {
  if (result.distance <= Constants.DISTANCE_THRESHOLD) {
    result.score = Number(result.score) + Constants.DISTANCE_FULL_MATCH;
  } else if (result.distance > Constants.DISTANCE_THRESHOLD_LIMIT_START && result.distance < Constants.DISTANCE_THRESHOLD_LIMIT_END) {
    result.score = Number(result.score) + Constants.DISTANCE_PARTIAL_MATCH;
  } else {
    result.score = Number(result.score) + Constants.DISTANCE_DEFAULT_MATCH;
  }

  return result;
}


const budget = (result, budget, budgetMin, budgetMax) => {
  // If both min and max are given
  if (!budget) {
    // If price is in range, make score 30%
    if (result.price <= budgetMax && result.price >= budgetMin) {
      result.score = Number(result.score) + Constants.BUDGET_MATCH_PERCENT;

    // if price is more than range
    // calculate percent of match using price and max value
    // convert that percent as percent of 30
    // add that value to score
    } else if (result.price > budgetMax) {
      result.score = Number(result.score) + Percentage.calculateMatchPercent(result.price, budgetMax, Constants.BUDGET_MATCH_PERCENT);

    // if price is less than range
    // calculate percent of match using price and min value
    // convert that percent as percent of 30
    // add that value to score
    } else if (result.price < budgetMin) {
      result.score = Number(result.score) + Percentage.calculateMatchPercent(result.price, budgetMin, Constants.BUDGET_MATCH_PERCENT);
    
    // Otherwise make score 0
    } else {
      result.score = 0;
    }

  // If any one value of min/max is given
  } else if (budget) {

    // Calculate 10% of budget, make budget-10 to budget+10 as range
    // if price is in the range then add score 30
    const bPercent = Percentage.percentage(budget, Constants.BUDGET_PLUS_MINUS_PERCENT);
    if (result.price >= Number(budget) - bPercent && result.price <= Number(budget) + bPercent) {
      result.score = Number(result.score) + Constants.BUDGET_MATCH_PERCENT;

    // if price not in range
    } else {

      // if price is more than the max budget
      // calculate percent of match using price and max value
      // convert that percent as percent of 30
      // add that value to score
      if (result.price > Number(budget) + bPercent) {
        result.score = Number(result.score) + Percentage.calculateMatchPercent(result.price, Number(budget) + bPercent, Constants.BUDGET_MATCH_PERCENT);
  
      // if price is less than range
      // calculate percent of match using price and min value
      // convert that percent as percent of 30
      // add that value to score
      } else if (result.price < Number(budget) - bPercent) {
        result.score = Number(result.score) + Percentage.calculateMatchPercent(result.price, Number(budget) - bPercent, Constants.BUDGET_MATCH_PERCENT);
      
      // Otherwise make score 0
      } else {
        result.score = 0;
      }
    }
  }

  return result;
}


// This processes for both bedrooms and bathrooms scoring
const room = (result, key, room, roomMin, roomMax) => {
  // If both min and max are given
  if (!room) {

    // If rooms is in range, make score 20%
    if (result[key] >= roomMin && result[key] <= roomMax) {
      result.score = Number(result.score) + Constants.ROOM_MATCH_PERCENT;

    // If rooms count is more than range
    // calculate percent of match using rooms count and max value
    // convert that percent as percent of 20
    // add that value to score
    } else if (result[key] > roomMax) {
      result.score = Number(result.score) + Percentage.calculateMatchPercent(result[key], roomMax, Constants.ROOM_MATCH_PERCENT);

    // If rooms count is less than range
    // calculate percent of match using rooms count and min value
    // convert that percent as percent of 20
    // add that value to score
    } else if (result[key] < roomMin) {
      result.score = Number(result.score) + Percentage.calculateMatchPercent(result[key], roomMin, Constants.ROOM_MATCH_PERCENT);

    // other wise make it 0
    } else {
      result.score = 0;
    }

  // If any one of min/max missing
  // Calculate the matching percentage
  } else {
    result.score = Number(result.score) + Percentage.calculateMatchPercent(result[key], room, Constants.ROOM_MATCH_PERCENT);
  }

  return result;
}


module.exports = {
  addScore,
  distance,
  budget,
  room
}