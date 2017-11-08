const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {
    useMongoClient: true
});

const CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

const Campground = mongoose.model("Campground", CampgroundSchema);

Campground.create({
    name: "Nile The River",
    image: "https://jungeunforschung.files.wordpress.com/2015/02/brahmaputra.jpg",
    description: "Amazing place. Loved by most of the nature lovers.",
}, function (err, campground) {
    if (err) {
        console.log("ERROR: ", err);
    } else {
        console.log(campground);
    }
});

const port = process.env.PORT | 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

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
            res.render('index', {
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

// CREATE: Get form to add new campground
app.get("/campgrounds/create", function (req, res) {
    res.render("create");
});

// SHOW: Get campground by id
app.get("/campgrounds/:id", function (req, res) {
    const id = req.params.id;
    Campground.findById(id, function (err, campground) {
        if (err) {
            console.log('ERROR: ', err);
        } else {
            res.render("show", {
                campground
            });
        }
    })
});

app.listen(port, function () {
    console.log("Yelp Camp server has started.");
});