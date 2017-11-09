const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// root/home route
router.get("/", function (req, res) {
    res.render('landing');
});

// GET route for signup
router.get("/register", function (req, res) {
    res.render("auth/register");
});

// POST route for singup
router.post("/register", function (req, res) {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    })
});

// GET route for login
router.get("/login", function (req, res) {
    res.render("auth/login");
});

// POST route for login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {

});

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;