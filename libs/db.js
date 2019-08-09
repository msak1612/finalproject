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

//online users
module.exports.getUsersById = function(ids) {
    return db.query(`SELECT * FROM users WHERE id IN (${ids})`);
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
        `SELECT id,first_name, last_name, profile_pic,bio
        FROM users ORDER BY created_at DESC LIMIT 3`
    );
};

//searchUsers
module.exports.searchUsers = function(val) {
    return db.query(
        `SELECT id, first_name, last_name, profile_pic,bio FROM users
        WHERE first_name ILIKE '${val}%'
        OR last_name ILIKE '${val}%'`
    );
};

//get the list of friend suggestions
module.exports.getSuggestedFriends = function(current_user, viewed_user) {
    return db.query(
        `SELECT users.id, first_name, last_name, bio, profile_pic,accepted
     FROM friendships
     JOIN users
     ON (((accepted = true AND receiver_id = ${viewed_user} AND sender_id = users.id)
     OR (accepted = true AND sender_id = ${viewed_user} AND receiver_id = users.id))
      AND users.id != ${current_user})`
    );
};

//showFriendship
module.exports.showFriendship = function(sender, receiver) {
    return db.query(`SELECT  ${receiver} as id, accepted,sender_id FROM friendships
        WHERE sender_id = ${sender} AND receiver_id = ${receiver}
        OR sender_id = ${receiver} AND receiver_id = ${sender}`);
};

//makeFriend
module.exports.makeFriendship = function(sender, receiver) {
    return db.query(
        `INSERT INTO friendships(sender_id, receiver_id, accepted)
        VALUES (${sender}, ${receiver}, ${false})
        RETURNING ${receiver} as id, accepted, sender_id`
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
        AND receiver_id = ${receiver}`
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
module.exports.getFriendsAndWannabes = function(sender) {
    return db.query(
        `SELECT users.id, first_name, last_name, bio, profile_pic, accepted,sender_id
     FROM friendships
     JOIN users
     ON (receiver_id = ${sender} AND sender_id = users.id)
     OR (sender_id =${sender} AND receiver_id = users.id)`
    );
};

//get the list of friend request count
module.exports.getFriendRequestCount = function(receiver) {
    return db.query(
        `SELECT count(*) FROM friendships WHERE
         (accepted=false AND receiver_id = ${receiver})`
    );
};

// post a comment on the user
module.exports.postText = function(sender, receiver, parent_post_id, text) {
    return db.query(
        `INSERT INTO posts(sender_id, receiver_id, parent_post_id, post)
        VALUES (${sender}, ${receiver}, ${parent_post_id}, '${text}')
        RETURNING *`
    );
};

//delete post
module.exports.deletePost = function(id) {
    return db.query(`DELETE FROM posts WHERE id = ${id}`);
};

// post a image comment on the user
module.exports.postImage = function(sender, receiver, parent_post_id, image) {
    return db.query(
        `INSERT INTO posts(sender_id, receiver_id, parent_post_id, image)
        VALUES (${sender}, ${receiver}, ${parent_post_id}, '${image}')
        RETURNING *`
    );
};

// Get comments on user's post
module.exports.getPosts = function(receiver_id, parent_post_id) {
    return db.query(
        `SELECT A.id, A.sender_id, A.post, A.image, A.days, A.hours,
         A.minutes, U.first_name, U.last_name,A.parent_post_id,
	    (SELECT count(id) FROM posts B WHERE
        A.id = B.parent_post_id ) as replycount FROM
        (SELECT *,
        EXTRACT(day FROM now() - created_at) as days,
        EXTRACT(hour FROM now() - created_at) as hours,
        EXTRACT(minute FROM now() - created_at) as minutes
        FROM posts where receiver_id=${receiver_id} AND
        parent_post_id=${parent_post_id}
        ORDER BY case when parent_post_id!=0
        then created_at end ASC, case when parent_post_id=0
        then created_at end DESC) A JOIN users U ON A.sender_id=U.id`
    );
};

//Add new chat message
exports.addChatMessage = function(sender_id, msg) {
    return db.query(
        `INSERT INTO chats (sender_id, message) VALUES (${sender_id}, '${msg}')
        RETURNING id, sender_id, message, to_char( created_at, 'DD MON YYYY HH24:MI:SS') as created_at`
    );
};

//get recent chat messages
exports.getRecentChatMessages = function() {
    return db.query(
        `SELECT chats.id, sender_id, message, to_char(chats.created_at, 'DD MON YYYY HH24:MI:SS') as created_at, users.first_name, users.last_name, users.profile_pic
        FROM chats JOIN users ON sender_id=users.id
        ORDER BY chats.created_at DESC LIMIT 10`
    );
};

//delete user
module.exports.deleteUser = function(id) {
    return db.query(`DELETE FROM users WHERE id = ${id}`);
};
