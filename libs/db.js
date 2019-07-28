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
