module.exports = http => {
    const io = require("socket.io")(http);
    const formatMessage = require('./utils/messages');
    const  {userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers }= require("./utils/users");

    const botName = "Enaland";
    const Messages = require("./model/Group_Messages");

    // listen for connection
    // Run when client connects
    io.on('connection', async socket => {
        socket.on('joinRoom', async ({ username, room }) => {
            userJoin(socket.id, username, room)
                .then(async user => {

                    socket.join(user.room);
                    // Broadcast when a user connects
                    // add to messages to database
        
                    const msg_chat = new Messages({
                        ...formatMessage(botName, `${user.username} has joined the chat`, "join")
                    })
                    await msg_chat.save();


                    // message users
                    Messages.find({})
                        .then(messages => {
                            io
                            .to(user.room)
                            .emit(
                            'message',
                            messages
                            );
                        })
        

                    getRoomUsers(user.room)
                        .then(users => {
                            // Send users and room info
                            io.to(user.room).emit('roomUsers', {
                                room: user.room,
                                users
                            });
                        })
                })
        
        });
    
        // Listen for chatMessage
        socket.on('chatMessage', async msg => {
            const user = await getCurrentUser(socket.id);

            // add to messages to database
            const msg_chat = new Messages({
                ...formatMessage(user.username, msg)
            })
            msg_chat.save()
                .then(()=> {
                    Messages.find({})
                        .then(messages => {
                            io.to(user.room).emit('message', messages);
                        })
                })
        });
    
        // Runs when client disconnects
        socket.on('disconnect',async () => {
            const user = await userLeave(socket.id);
        
            if (user) {
                // add to messages to database
                const msg_chat = new Messages({
                    ...formatMessage(botName, `${user.username} has left the chat`, "left")
                })
                await msg_chat.save();
                const messages = await Messages.find({})


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