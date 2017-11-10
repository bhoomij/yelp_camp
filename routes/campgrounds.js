const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    messages = require("../utility/utils"),
    { isLoggedIn, checkCampgroundAuthorization } = require("../middleware");


// INDEX: get all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err || !campgrounds) {
            console.log(err);
            const error = !campgrounds ? "Campgrouds not found" : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("back");
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
            console.log(err);
            req.flash("error", messages.somethingwentwrong);
        } else {
            req.flash("success", "Campground - " + newCampground.name + " added successfully");
        }
        res.redirect("/campgrounds");
    });

});

// SHOW: Get campground by id
router.get("/:id", function (req, res) {
    const id = req.params.id;
    Campground.findById(id).populate("comments").exec(function (err, campground) {
        if (err || !campground) {
            console.log(err);
            const error = !campground ? "Campgroud not found" : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {
                campground
            });
        }
    })
});

// EDIT: get route for campground edit
router.get("/:id/edit", checkCampgroundAuthorization, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err || !campground) {
            console.log(err);
            const error = !campground ? "Campgroud not found" : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", { campground });
        }
    });
});

// UPDATE: put route for campground edit
router.put("/:id", checkCampgroundAuthorization, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campgroud, { new: true }, function (err, campground) {
        if (err || !campground) {
            console.log(err);
            const error = !campground ? "Campgroud not found" : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("back");
        } else {
            req.flash("success", "Campground - " + campground.name + " updated successfully");
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// DELETE: route for campground remove
router.delete("/:id", checkCampgroundAuthorization, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, campground) {
        if (err || !campground) {
            console.log(err);
            const error = !campground ? "Campgroud not found" : messages.somethingwentwrong;
            req.flash("error", error);
        } else {
            req.flash("success", "Campground - " + campground.name + " deleted successfully");
        }
        res.redirect("back");
    });
});

module.exports = router;