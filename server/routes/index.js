const { OrderController, CollectionController } = require("../controllers");

const Router = require("express").Router;

const router = new Router();

router.post("/orders", OrderController.create);
router.get("/orders", OrderController.getAll);
router.delete("/orders/:signature", OrderController.deleteOrder);

router.get("/collections", CollectionController.getAll);
router.post("/collections", CollectionController.create);

module.exports = router;
