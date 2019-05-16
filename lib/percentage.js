const percentage = (value, percent) => {
  return (Number(value) * percent) / 100;
}

const matchPercentage = (value, valueTwo) => {
  if (value < valueTwo) {
    return (value / valueTwo) * 100;
  }

  return (valueTwo / value) * 100;
}


const calculateMatchPercent = (valueOne, valueTwo, percentThreshold) => {
  let bPercent = matchPercentage(valueOne, valueTwo);
  return Number(valueOne) + percentage(percentThreshold, bPercent);
}


module.exports = {
  percentage,
  matchPercentage,
  calculateMatchPercent
};
