const Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    messages = require("../utility/utils");

var middleware = {};

middleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middleware.checkCampgroundAuthorization = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err || !campground) {
                console.log(err);
                const error = !campground ? "Campgroud not found" : messages.somethingwentwrong;
                req.flash("error", error);
                res.redirect("back");
            } else {

                if (campground.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middleware.checkCommentAuthorization = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, function (err, comment) {
            if (err || !comment) {
                console.log(err);
                const error = !comment ? "Comment not found" : messages.somethingwentwrong;
                req.flash("error", error);
                res.redirect("back");
            } else {

                if (comment.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

module.exports = middleware;