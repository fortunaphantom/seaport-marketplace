const config = require("./config");
const express = require("./services/express");
const routes = require("./routes");
const { connectMongo } = require("./services/mongoose");

connectMongo("mongodb://127.0.0.1:27017/rinzo_market");

const port = process.env.PORT || 4000;
const app = express(routes);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
