const get = (min, max) => {
  if (min && max) {
    return undefined;
  }

  if (!min) {
    return max;
  }

  if (!max) {
    return min;
  }

  return undefined;
}


module.exports = {
  get
};