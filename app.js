const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    seedDB = require("./seeder/seed"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

// seedDB();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {
    useMongoClient: true
});


const port = process.env.PORT | 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render('landing');
});

// INDEX: get all campgrounds
app.get("/campgrounds", function (req, res) {
    Campground.find(function (err, campgrounds) {
        if (err) {
            console.log(err)
        } else {
            console.log(campgrounds);
            res.render('campgrounds/index', {
                campgrounds
            });
        }
    });

});

// CREATE: Add new campground
app.post("/campgrounds", function (req, res) {
    Campground.create(req.body, function (err) {
        if (err) {
            console.log("ERROR: ", err);
        } else {
            res.redirect("/index");
        }
    });

});

// NEW: Get form to add new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

// SHOW: Get campground by id
app.get("/campgrounds/:id", function (req, res) {
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

/*
COMMENT ROUTES
*/

// CREATE: Get form to add new comment
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground });
        }
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

app.listen(port, function () {
    console.log("Yelp Camp server has started.");
});