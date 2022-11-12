const { response } = require("express");
var express = require("express");
var router = express.Router();
var post_md = require("../models/post")

router.get("/", function(req, res) {
    var posts = post_md.getAllPosts();

    posts.then(function(data) {
        return res.render("blog/index", { posts: data ,error: false});
    }).catch(function(err){
        return res.render("blog/index", {error: "Could not get posts data"});
    });
});
router.get("/post/:id", function(req, res) {
    var params = req.params;
    var result = post_md.getPostById(params.id);
    
    result.then(function(data){
        return res.render("blog/post", {result : {post: data[0]}, error: false});
    }).catch(function(err){
        console.log(err);
        return res.render("blog/post", {error: "Get Post Data Error" });
    });
});
router.get("/about", function(req, res) {
    return res.render("blog/about");
});
router.get("/contact", function(req, res) {
    return res.render("blog/contact");
});

module.exports = router;