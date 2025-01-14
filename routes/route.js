const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.indexActionGet);
router.get("/new", controller.newActionGet);
router.post("/new", controller.newActionPost);
router.get("/search", controller.searchActionGet);

module.exports = router;
