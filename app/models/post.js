var q = require("q");
var db = require("../common/database");
var conn = db.getConnection();

function getAllPosts() {
    var defer = q.defer();
    conn.query('SELECT * FROM posts', function(err, result) {
        if(err){
            defer.reject(err);
        } else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}
function newPost(post) {
    var defer = q.defer();

    conn.query('INSERT INTO posts set ?', post, function(err, result) {
        if(err){
            defer.reject(err);
        } else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}
function getPostById(id) {
    if(id) {
        var defer = q.defer();
        conn.query('SELECT * FROM posts WHERE ?', {id: id}, function(err, result) {
            if(err){
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
}

function updatePost(post) {
    if(post) {
        var defer = q.defer();
        conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?', 
        [post.title, post.content, post.author, post.updated_at, post.id], function(err, result) {
            if(err){
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
}

function deletePost(id) {
    if(id) {
        var defer = q.defer();
        conn.query('DELETE FROM posts WHERE ?', {id: id}, function(err, result) {
            if(err){
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
}

module.exports = {
    getAllPosts: getAllPosts,
    addPost: newPost,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePost: deletePost
};