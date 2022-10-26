const config = require("./config");
const express = require("./services/express");
const routes = require("./routes");

const port = process.env.PORT || 4000;
const app = express(routes);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
