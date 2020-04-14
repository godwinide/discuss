const users = require("../model/Chat_Users");

// Join user to chat
async function userJoin(id, username, room) {
  return new Promise((resolve, reject) => {
    const _user = new users({ s_id:id, username, room });

    _user.save()
      .then(user => {
        resolve(user)
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
    return isActive;
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
