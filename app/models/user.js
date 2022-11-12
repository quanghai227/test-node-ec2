var q = require("q");
var db = require("../common/database");
var conn = db.getConnection();

function addUser(user) {
    var defer = q.defer();

    var query = conn.query('INSERT INTO users set ?', user, function(err, result) {
        if(err){
            defer.reject(err);
        } else {
            defer.resolve(result);
        }
        
    });
    return defer.promise;
}

function getUserByEmail(email) {
    var defer = q.defer();
    if(email) {
        conn.query('SELECT * FROM users WHERE ?', {email: email}, function(err, result) {
            if(err){
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
}

function getAllUsers() {
    var defer = q.defer();
    conn.query('SELECT id, email, first_name, last_name, created_at FROM users', function(err, result) {
        if(err){
            defer.reject(err);
        } else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}

module.exports = {
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers
};