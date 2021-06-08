const users = []

function addUser(user) {
    users.push(user)
    console.log(users)
}

function getRoomUser(room) {
    return users.filter(item => item.room === room)
}

module.exports = {
    addUser,
    getRoomUser
}