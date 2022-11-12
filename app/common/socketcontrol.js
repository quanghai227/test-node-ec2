module.exports = function(io) {
    var usernames = [];
    
    io.sockets.on("connection", function(socket) {
        console.log("Have a new user connected");

        // Listen adduser event
        socket.on("adduser", function(username) {
            //Save
            socket.username = username;
            usernames.push(username);

            // Notify to myself (cap nhat thong bao cho rien minh da vao room chat)
            var data = {
                sender: "SERVER",
                message: "You have join chat room"
            };
            socket.emit("update_message", data);

            // Notify to other users (cap nhat thong bao cho tat ca user da vao room chat)
            var data = {
                sender: "SERVER",
                message: username + " have join to chat room"
            };
            socket.broadcast.emit("update_message", data);
        });

        // Listen send_message event
        socket.on("send_message", function(message){
            // Notify to myself
            var data = {
                sender: "You",
                message: message
            };
            socket.emit("update_message", data);

            // Notify to other users
            var data = {
                sender: socket.username,
                message: message
            };
            socket.broadcast.emit("update_message", data);
        });

        // Listen disconnect event
        // socket.on("disconnect", function(){
        //     // Delete username
        //     for(var i = 0; i = usernames.length; i++) {
        //         if(usernames[i] == socket.username) {
        //             usernames.splice(i, 1);
        //             break;
        //         }
        //     }
        //     console.log("usernames", usernames, socket.username);

        //     // Notify to other users
        //     var data = {
        //         sender: "SERVER",
        //         message: socket.username + " leave chat room"
        //     };
        //     socket.broadcast.emit("update_message", data);
        // });

    });
}