const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require("passport"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seeder/seed"),
    User = require("./models/user");

const authRoutes = require("./routes/auth"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments");

// seedDB();
const url = process.env.DB_URL || "mongodb://localhost/yelp_camp";
const port = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
mongoose.connect(url, {
    useMongoClient: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// init passport
app.use(require("express-session")({
    secret: "asfgfdopkdfop mdfodsopvd dfsokvspv  sdvp[kxdfscaz",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.loggedInUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, function () {
    console.log(`Yelp Camp server has started on port ${port}`);
});