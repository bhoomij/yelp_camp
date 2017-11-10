const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    messages = require("../utility/utils"),
    Comment = require("../models/comment"),
    { isLoggedIn, checkCommentAuthorization } = require("../middleware");

// CREATE: Get form to add new comment
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err || !campground) {
            console.log(err);
            const error = !campground ? messages.campgroundNotFound : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", { campground });
        }
    });
});

// CREATE: post route to add new comment
router.post("/", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err || !campground) {
            console.log(err);
            const error = !campground ? messages.campgroundNotFound : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    res.redirect("back");
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

// EDIT: route for comment edit form
router.get("/:commentId/edit", checkCommentAuthorization, function (req, res) {
    Comment.findById(req.params.commentId, function (err, comment) {
        if (err || !comment) {
            console.log(err);
            const error = !comment ? messages.commentNotFound : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("back");
        } else {
            res.render("comments/edit", { campgroundId: req.params.id, comment });
        }
    });
});

// UPDATE: route for comment update
router.put("/:commentId", checkCommentAuthorization, function (req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function (err, comment) {
        if (err || !comment) {
            console.log(err);
            const error = !comment ? messages.commentNotFound : messages.somethingwentwrong;
            req.flash("error", error);
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }

    });
});

// DELETE: route for comment delete
router.delete("/:commentId", checkCommentAuthorization, function (req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function (err, comment) {
        if (err || !comment) {
            console.log(err);
            const error = !comment ? messages.commentNotFound : messages.somethingwentwrong;
            req.flash("error", error);
        } else {
            req.flash("success", "Comment deleted successfully");
        }
        res.redirect("back");
    });
});

module.exports = router;