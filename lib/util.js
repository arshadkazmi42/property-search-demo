const formatKey = ({ lat, lng, budgetMin, budgetMax, bathroomMin, bathroomMax, bedroomMin, bedroomMax, offset }) => {
  return `${lat}_${lng}_${budgetMin}_${budgetMax}_${bathroomMin}_${bathroomMax}_${bedroomMin}_${bedroomMax}_${offset}`;
}


module.exports = {
  formatKey
}