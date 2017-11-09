const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");


// INDEX: get all campgrounds
router.get("/", function (req, res) {
    Campground.find(function (err, campgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds', {
                campgrounds
            });
        }
    });

});

// NEW: Get form to add new campground
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// CREATE: Add new campground
router.post("/", isLoggedIn, function (req, res) {
    let newCampground = req.body.campgroud;
    newCampground.author = {
        id: req.user.id,
        username: req.user.username
    };
    Campground.create(newCampground, function (err) {
        if (err) {
            console.log("ERROR: ", err);
        } else {
            res.redirect("/campgrounds");
        }
    });

});

// SHOW: Get campground by id
router.get("/:id", function (req, res) {
    const id = req.params.id;
    Campground.findById(id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log('ERROR: ', err);
        } else {
            res.render("campgrounds/show", {
                campground
            });
        }
    })
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;