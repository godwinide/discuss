const router = require("express").Router();

const {ensureAuthenticated} = require("../config/auth");

router.get("/", ensureAuthenticated, (req,res) => {
    res.render("index", {req});
});

module.exports = router;