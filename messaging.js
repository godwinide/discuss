module.exports = http => {
    const io = require("socket.io")(http);
    const formatMessage = require('./utils/messages');
    const  {userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers }= require("./utils/users");

    const botName = "Enaland";
    const messages = [];

    // listen for connection
    // Run when client connects
    io.on('connection', socket => {
        socket.on('joinRoom', ({ username, room }) => {
            const user = userJoin(socket.id, username, room);
        
            socket.join(user.room);
        
            // Broadcast when a user connects
            // add to messages array
            messages.push(formatMessage(botName, `${user.username} has joined the chat`, "join"));
            io
                .to(user.room)
                .emit(
                'message',
                messages
                );
        
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        });
    
        // Listen for chatMessage
        socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        // add to messages array and emit
        messages.push(formatMessage(user.username, msg));
        io.to(user.room).emit('message', messages);
        });
    
        // Runs when client disconnects
        socket.on('disconnect', () => {
        // const user = userLeave(socket.id);
    
        if (user) {
            // add to messages array and emit
            messages.push(formatMessage(botName, `${user.username} has left the chat`, "left"))
            io.to(user.room).emit(
            'message',
            messages
            );
    
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
            });
        }
        });
    });
}