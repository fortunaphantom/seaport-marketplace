const Router = require("express").Router;
const Controllers = require("../controllers");

const router = new Router();

router.post("/", Controllers.Main.create);
router.get("/", Controllers.Main.getAll);
router.delete("/:signature", Controllers.Main.deleteOrder);

module.exports = router;
