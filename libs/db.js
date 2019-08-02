var spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/social-network");
}

//registration
module.exports.addUser = function(firstName, lastName, pwd, email) {
    return db.query(
        `INSERT INTO users(first_name, last_name, pwd, email)
        VALUES ('${firstName}', '${lastName}', '${pwd}', '${email}') RETURNING id`
    );
};

//login
module.exports.getUserByEmail = function(email) {
    return db.query(`SELECT * FROM users WHERE email='${email}'`);
};

module.exports.getUserById = function(id) {
    return db.query(`SELECT * FROM users WHERE id=${id}`);
};

//addProfilePic
module.exports.addProfilePic = function(imageUrl, id) {
    return db.query(`
        UPDATE users
        SET profile_pic = '${imageUrl}'
        WHERE id = ${id}
        RETURNING *`);
};

//addBio
module.exports.addBio = function(bio, id) {
    return db.query(
        `UPDATE users SET bio = '${bio}' WHERE id = ${id} RETURNING *`
    );
};

//getRecentUsers
module.exports.getRecentUsers = function() {
    return db.query(
        `SELECT id,first_name, last_name, profile_pic
        FROM users ORDER BY created_at DESC LIMIT 3`
    );
};

//searchUsers
module.exports.searchUsers = function(val) {
    return db.query(
        `SELECT id, first_name, last_name, profile_pic FROM users
        WHERE first_name ILIKE '${val}%'
        OR last_name ILIKE '${val}%'`
    );
};

//showFriendship
module.exports.showFriendship = function(sender, receiver) {
    return db.query(`SELECT * FROM friendships
        WHERE sender_id = ${sender} AND receiver_id = ${receiver}
        OR sender_id = ${receiver} AND receiver_id = ${sender}`);
};

//makeFriend
module.exports.makeFriendship = function(sender, receiver) {
    return db.query(
        `INSERT INTO friendships(sender_id, receiver_id, accepted)
        VALUES (${sender}, ${receiver}, ${false})
        RETURNING *`
    );
};

module.exports.cancelFriendship = function(sender, receiver) {
    return db.query(
        `DELETE FROM friendships
        WHERE sender_id = ${sender} AND receiver_id = ${receiver}
        OR sender_id = ${receiver} AND receiver_id = ${sender}`
    );
};

module.exports.acceptFriendship = function(sender, receiver) {
    return db.query(
        `UPDATE friendships SET accepted=true WHERE sender_id = ${sender}
        AND receiver_id = ${receiver} RETURNING *`
    );
};

module.exports.endFriendship = function(sender, receiver) {
    return db.query(
        `DELETE FROM friendships
        WHERE sender_id = ${sender} AND receiver_id = ${receiver}
        OR sender_id = ${receiver} AND receiver_id = ${sender}`
    );
};

//get the list of friends and wannabes
module.exports.getFriendsAndWannabes = function(sender, receiver) {
    return db.query(
        `SELECT users.id, first, last, profile_pic, accepted
                FROM friendships
                JOIN users
                ON (accepted = false AND recipient_id = ${sender} AND requester_id = users.id)
                OR (accepted = true AND recipient_id = ${sender} AND requester_id = users.id)
                OR (accepted = true AND requester_id = ${sender} AND recipient_id = users.id)`
    );
};
