const fs = require("fs");
const { Order } = require("../models");
const resolvePath = require("path").resolve;

async function create(req, res) {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (ex) {
    console.log(ex);
    res.status(500).json(ex);
  }
}

async function getAll(req, res) {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (ex) {
    console.log(ex);
    res.status(500).json(ex);
  }
}

async function deleteOrder(req, res) {
  try {
    const { signature } = req.params;
    await Order.deleteOne({signature});
    res.json("success");
  } catch (ex) {
    console.log(ex);
    res.status(500).json(ex);
  }
}

module.exports = {
  create,
  getAll,
  deleteOrder,
};
