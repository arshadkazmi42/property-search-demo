const express = require('express');
const port = 8000;
const app = express();
const PropertyController = require('./controllers/property');

app.post('/properties', async function (req, res, next) {
  await PropertyController.get(req, res);
  next();
})

app.listen(port, function () {
  console.log("Server is running on "+ port +" port");
});