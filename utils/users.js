const users = require("../model/Chat_Users");

// Join user to chat
async function userJoin(id, username, room) {
  return new Promise((resolve, reject) => {
    users.findOne({s_id:id})
      .then(user => {
        // check if use already exists
        if(user){
          // no need to create new user
          users.findOneAndUpdate({s_id:id})
            .then(user => {
              resolve(user)
            })
        }else{
          const _user = new users({ s_id:id, username, room });
          _user.save()
            .then(user => {
              resolve(user)
            })
        }
      })
  })
}

// Get current user
async function getCurrentUser(id) {
  return new Promise((resolve, reject) => {
    users.findOne({s_id:id})
      .then(user => {
        resolve(user);
      }) 
  })
}

// User leaves chat
async function userLeave(id) {
  const isActive = await users.findOne({s_id:id});

  if (isActive) {
    users.deleteOne({s_id:id})
    .then(()=>{
      return isActive;
    })
  }
}

// Get room users
async function getRoomUsers(room) {
  return new Promise(async (resolve, reject) => {
    const _users = await users.find({room});
    resolve(_users);
  })
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
