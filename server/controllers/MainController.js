const fs = require("fs");
const resolvePath = require("path").resolve;

const dbPath = resolvePath(__dirname, "../storage/orders.json");

async function create(req, res) {
  const { order } = req.body;
  const contents = fs.readFileSync(dbPath, "utf8");
  const orders = JSON.parse(contents);
  orders.push(order);
  fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2));
  res.json(order);
}

async function getAll(req, res) {
  const contents = fs.readFileSync(dbPath, "utf8");
  const orders = JSON.parse(contents);
  res.json(orders);
}

async function deleteOrder(req, res) {
  const { signature } = req.params;
  const contents = fs.readFileSync(dbPath, "utf8");
  const orders = JSON.parse(contents);
  const index = orders.findIndex((order) => order.signature === signature);
  if (index !== -1) {
    orders.splice(index, 1);
    fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2));
  }
  res.json("success");
}

module.exports = {
  create,
  getAll,
  deleteOrder,
};
