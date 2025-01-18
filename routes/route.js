const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.indexGet);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", controller.signUpPost);

module.exports = router;
