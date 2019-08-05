const express = require("express");
const app = express();
const compression = require("compression");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 mapme.herokuapp.com:*"
});

const cookieSession = require("cookie-session");
const csurf = require("csurf");

const db = require("./libs/db");
const bc = require("./libs/bc");
const s3 = require("./libs/s3");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
var config = require("./config");

app.use(express.static("./public"));

app.use(require("body-parser").json());

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());

//axios can read the cookie
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        const imageUrl = config.s3Url + req.file.filename;
        db.addProfilePic(imageUrl, req.session.userId)
            .then(vals => {
                res.json({ image: vals.rows[0].profile_pic });
            })
            .catch(err => {
                console.log("Error in upload: ", err);
                res.status(500).json();
            });
    } else {
        console.log("Error in upload: ");
        res.status(500).json();
    }
});

app.get("/user", async (req, res) => {
    try {
        const user = await db.getUserById(req.session.userId);
        if (!user.profile_pic) {
            user.profile_pic = "/images/default.png";
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.log("Error Message: ", err);
        res.status(500).json();
    }
});

//Part 5 + Part 7
app.get("/api/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.getUserById(id);
        if (!user.profile_pic) {
            user.profile_pic = "/images/default.png";
        }
        const friendshipStatus = await db.showFriendship(
            req.session.userId,
            id
        );
        let userInfo = user.rows[0];
        if (
            friendshipStatus &&
            friendshipStatus.rowCount > 0 &&
            friendshipStatus.rows[0].accepted
        ) {
            let suggestions = await db.getSuggestedFriends(
                req.session.userId,
                id
            );
            userInfo.suggestions = suggestions.rows;
        }

        res.json({
            user: userInfo,
            sameUser: req.session.userId == id,
            friendshipStatus: friendshipStatus.rows
        });
    } catch (err) {
        console.log("Error Message: ", err);
        res.status(500).json();
    }
}); //url should be different than in BR

// Part 7
app.post("/api/user/:id", async (req, res) => {
    try {
        let friendshipStatus;
        const { id } = req.params;
        let action = req.body.action;
        let receiver_id = id;
        let sender_id = req.session.userId;
        if (action == "send") {
            friendshipStatus = await db.makeFriendship(sender_id, receiver_id);
        } else if (action == "cancel") {
            friendshipStatus = await db.cancelFriendship(
                sender_id,
                receiver_id
            );
        } else if (action == "accept") {
            friendshipStatus = await db.acceptFriendship(
                receiver_id,
                sender_id
            );
        } else if (action == "end") {
            friendshipStatus = await db.endFriendship(sender_id, receiver_id);
        }
        res.json({
            friendshipStatus: friendshipStatus.rows[0]
        });
    } catch (err) {
        console.log("Error Message: ", err);
        res.status(500).json();
    }
});

app.get("/api/friends", async (req, res) => {
    try {
        const friends = await db.getFriendsAndWannabes(req.session.userId);
        res.json(friends.rows);
    } catch (err) {
        console.log("Error Message: ", err);
        res.status(500).json();
    }
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// POST /register with async
app.post("/register", async (req, res) => {
    var alphanum = /^[0-9a-zA-Z]+$/;
    var email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var first = req.body.first ? req.body.first : "";
    var last = req.body.last ? req.body.last : "";
    if (
        ((first && alphanum.test(String(first.value).toLowerCase())) ||
            (last && alphanum.test(String(last.value).toLowerCase()))) &&
        req.body.pwd &&
        (req.body.email && email.test(String(req.body.email).toLowerCase()))
    ) {
        try {
            let buff = Buffer.from(req.body.pwd, "base64");
            let text = buff.toString("ascii");
            let securedPwd = await bc.hashPassword(text);
            let user = await db.addUser(
                first,
                last,
                securedPwd,
                req.body.email
            );
            req.session.userId = user.rows[0].id;
            res.json({ success: true });
        } catch (err) {
            console.log("Error in POST /registration: ", err);
            res.json({ success: false });
        }
    } else {
        console.log("Invalid input for registration");
        res.json({ success: false });
    }
});

app.post("/login", (req, res) => {
    let userInfo;
    db.getUserByEmail(req.body.login)
        .then(val => {
            if (val.rowCount > 0) {
                userInfo = val.rows[0];
                let buff = Buffer.from(req.body.pwd, "base64");
                let text = buff.toString("ascii");
                return bc.checkPassword(text, val.rows[0].pwd);
            } else {
                return Promise.reject();
            }
        })
        .then(matched => {
            if (matched) {
                req.session.userId = userInfo.id;
                res.json(userInfo);
            } else {
                return Promise.reject();
            }
        }, userInfo)
        .catch(err => {
            console.log("Error in POST /login: ", err);
            res.status(500).json();
        });
});

app.post("/bio", (req, res) => {
    const bio = req.body.bio;
    db.addBio(bio, req.session.userId)
        .then(val => {
            res.json(val.rows[0]);
        })
        .catch(err => {
            console.log("Error in adding bio of user ", err);
        });
});

app.get("/api/users", (req, res) => {
    let promise;
    if (req.query.search) {
        promise = db.searchUsers(req.query.search);
    } else {
        promise = db.getRecentUsers();
    }
    promise
        .then(val => {
            res.json(val.rows);
        })
        .catch(err => {
            console.log("Error in Getting Recently joined users ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

if (require.main == module) {
    server.listen(process.env.PORT || 8080, () =>
        console.log("Server is Running at localhost:8080")
    );
}

/************************ socketio usage *******************************/
io.on("connection", socket => {
    let mySocketId;
    console.log(`A socket with the id ${socket.id} just connected.`);

    console.log(socket.request.headers);

    socket.emit("greeting", {
        message: "Welome. It is nice to see you"
    });

    io.emit("newPlayer", {});

    if (mySocketId) {
        io.sockets.sockets[mySocketId].emit("targetedMessage");
    }

    mySocketId = socket.id;

    socket.on("niceToBeHere", payload => console.log(payload));

    socket.on("disconnect", () => {
        console.log(`A socket with the id ${socket.id} just disconnected.`);
    });
});
/************************ socketio usage *******************************/
