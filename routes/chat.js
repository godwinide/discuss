const router = require("express").Router();

const {ensureAuthenticated} = require("../config/auth");

router.get("/",(req,res) => {
    const {room} = req.query;
    res.render("chat", {req, room})
});

module.exports = router;