const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
    text: String,
    author: String
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;