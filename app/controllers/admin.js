var express = require("express");
var router = express.Router();

var helper  = require("../helper/helper");
var user_md = require("../models/user");
var post_md = require("../models/post");


router.get("/", function(req, res) {
    if(!req.session.User){
        return res.redirect("/admin/login");
    }
    return res.render("admin/dashboard", {data: {}, errors: {}});
    // return res.json({ "message": "This is Blog page" });
});
router.get("/post", function(req, res) {
    if(!req.session.User){
        return res.redirect("/admin/login");
    }
    var posts = post_md.getAllPosts();

    posts.then(function(data) {
        return res.render("admin/post/list", { posts: data ? data : {} });
    }).catch(function(err){
        return res.render("admin/post/list", {posts: {},  errors: {lists: "No posts data"}});
    });
});

router.get("/post/add", function(req, res) {
    if(!req.session.User){
        return res.redirect("/admin/login");
    }
    return res.render("admin/post/add", {data: {}, errors: {}});
});
router.post("/post/add", function(req, res) {
    var post = req.body;
    //Insert to DB
    var now = new Date();
    var user_create = req.session.User.first_name + " " + req.session.User.last_name;
    post = {
        title: post.title,
        content: post.content,
        author: user_create ? user_create : "get session user",
        created_at: now,
        updated_at: now
    };

    var result = post_md.addPost(post);
    result.then(function(data){
        console.log(data);
        return res.status(200).json({status_code: 200});
    }).catch(function(err){
        console.log(err);
        return res.status(500).json({status_code: 500});
    });
    // result.then(function(data){
    //     return res.redirect("/admin/post");
    // }).catch(function(err){
    //     console.log(err);
    //     return res.render("admin/post/add", {errors: {add: "Could not insert post data to DB" }});
    // });
});

router.get("/post/edit/:id", function(req, res) {
    if(!req.session.User){
        return res.redirect("/admin/login");
    }
    var params = req.params;
    
    var result = post_md.getPostById(params.id);
    
    result.then(function(data){
        return res.render("admin/post/edit", {result : {post: data[0]}, errors: false});
    }).catch(function(err){
        console.log(err);
        return res.render("admin/post/edit", {errors: {getpost: "Get Post Data Error" }});
    });
});
router.put("/post/edit", function(req, res) {
    var post = req.body;
    var now = new Date();
    var user_create = req.session.User.first_name + " " + req.session.User.last_name;
    var post_edit = {
        id: post.id,
        title: post.title,
        content: post.content,
        author: user_create ? user_create : "get session user",
        updated_at: now
    }
    var result = post_md.updatePost(post_edit);
    
    result.then(function(data){
        return res.status(200).json({status_code: 200});
    }).catch(function(err){
        console.log(err);
        return res.status(500).json({status_code: 500});
    });
});
router.delete("/post/delete", function(req, res) {
    var params = req.body;
    
    var result = post_md.deletePost(params.id);
    result.then(function(data){
        return res.status(200).json({status_code: 200});
    }).catch(function(err){
        console.log(err);
        return res.status(500).json({status_code: 500});
    });
});

//User
router.get("/user", function(req, res) {
    if(!req.session.User){
        return res.redirect("/admin/login");
    }
    var users = user_md.getAllUsers();

    users.then(function(data) {
        return res.render("admin/user/list", { users: data });
    }).catch(function(err){
        return res.render("admin/user/list", {users: {}, errors: {lists: "No posts data"}});
    });
});


router.get("/signup", function(req, res){
    res.render("signup", {data: {}, errors: {}});
});
router.post("/signup", function(req, res) {
    var user = req.body;

    if(user.email.trim().length == 0) {
        return res.render("signup", {errors: {email: "Email is required"}});
    }
    if(user.password != user.repassword && user.password.trim().length == 0) {
        return res.render("signup", { errors: { password: "Password is not Match" }});
    }
    
    //Insert to DB
    var password = helper.hash_password(user.password);
    var now = new Date();
    user = {
        email: user.email,
        password: password,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: now,
        updated_at: now
    };

    var result = user_md.addUser(user);
    result.then(function(data){
        return res.redirect("/admin/login");
    }).catch(function(err){
        console.log(err);
        return res.render("signup", {errors: {add: "Could not insert user data to DB" }});
    });
});
router.get("/login", function(req, res){
    res.render("login", {data: {}, errors: {}});
});
router.post("/login", function(req, res){
    var login = req.body;
    if(login.email.trim().length == 0) {
        return res.render("login", {errors: {email: "Email is required"}});
    }
    if(login.password.trim().length == 0) {
        return res.render("login", {errors: {password: "Password is required"}});
    } 
    var data = user_md.getUserByEmail(login.email);

    data.then(function(user) {
        var user = user[0];
        var status = helper.compare_password(login.password, user.password);

        if(!status) {
            return res.render("login", {errors: {password: "Password Wrong"}});
        }
        req.session.User = user;
        // console.log(req.session.User);
        return res.render("admin/dashboard", {data: {}, errors: {}});
        // return res.redirect("/admin/"); //error
        
    }).catch(function(err){
        return res.render("login", {errors: {email: "Email not exits"}});
    });
});


module.exports = router;