var mongoose = require("mongoose"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

var data = [{
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam facilis mollitia, dolorem numquam, veniam deserunt blanditiis praesentium odit voluptatum molestias quibusdam neque et! Reprehenderit laboriosam facere deserunt nulla, odit doloremque."
},
{
    name: "Desert Mesa",
    image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam facilis mollitia, dolorem numquam, veniam deserunt blanditiis praesentium odit voluptatum molestias quibusdam neque et! Reprehenderit laboriosam facere deserunt nulla, odit doloremque."
},
{
    name: "Canyon Floor",
    image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam facilis mollitia, dolorem numquam, veniam deserunt blanditiis praesentium odit voluptatum molestias quibusdam neque et! Reprehenderit laboriosam facere deserunt nulla, odit doloremque."
}
];


function seedDB() {
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all campgrounds");
        }
    });
    // data.forEach(function (campground) {
    //     Campground.create(campground, function (err, campground) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log("Added campground");
    //             Comment.create({
    //                 text: "This place is great, but I wish there was internet",
    //                 author: "Homer"
    //             }, function (err, comment) {
    //                 campground.comments.push(comment);
    //                 campground.save();
    //                 console.log("Added new comment");
    //             });
    //         }
    //     });
    // })
};

module.exports = seedDB;