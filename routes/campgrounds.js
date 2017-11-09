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

// EDIT: get route for campground edit
router.get("/:id/edit", isAuthorizedUser, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds" + req.params.id);
        } else {
            res.render("campgrounds/edit", { campground });
        }
    });
});

// UPDATE: put route for campground edit
router.put("/:id", isAuthorizedUser, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campgroud, function (err, campground) {
        if (err) {
            console.log(err);
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// DELETE: route for campground remove
router.delete("/:id", isAuthorizedUser, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/campgrounds");
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function isAuthorizedUser(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (campground.author.id.equals(req.user.id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;