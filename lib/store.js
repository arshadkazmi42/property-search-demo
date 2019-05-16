const store = {}

const set = (key, value) => {
  store[key] = value;
}

const get = (key) => {
  return store[key];
}


module.exports = {
  set,
  get
}