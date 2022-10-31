const { Collection } = require("../models");

async function getAll(req, res) {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (ex) {
    console.log(ex);
    res.status(500).json(ex);
  }
}

async function create(req, res) {
  try {
    const collection = new Collection(req.body);
    await collection.save();
    res.json(collection);
  } catch (ex) {
    console.log(ex);
    res.status(500).json(ex);
  }
}

module.exports = {
  getAll,
  create,
};
