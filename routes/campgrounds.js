const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");


// INDEX: get all campgrounds
router.get("/", function (req, res) {
    Campground.find(function (err, campgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds/index', {
                campgrounds
            });
        }
    });

});

// CREATE: Add new campground
router.post("/", function (req, res) {
    Campground.create(req.body, function (err) {
        if (err) {
            console.log("ERROR: ", err);
        } else {
            res.redirect("/index");
        }
    });

});

// NEW: Get form to add new campground
router.get("/new", function (req, res) {
    res.render("campgrounds/new");
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

module.exports = router;