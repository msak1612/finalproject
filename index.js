const express = require("express");
const app = express();
const compression = require("compression");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 madhuri-socialnetwork.herokuapp.com:*"
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

const fs = require("fs");
const http = require("http");
const jest = require("jest");

app.use(express.static("./public"));

app.use(require("body-parser").json());

const onlineUsers = new Map();

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

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

function load_challenges() {
    const root_dir = path.join(__dirname, "challenges");
    fs.readdir(root_dir, function(err, files) {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }

        files.forEach(function(dir) {
            const level_dir = path.join(root_dir, dir);
            let level = parseInt(dir);
            fs.readdir(level_dir, function(err, files) {
                if (err) {
                    return console.log("Unable to scan directory: " + err);
                }
                files.forEach(function(challenge_dir) {
                    const challenge_path = path.join(level_dir, challenge_dir);
                    let description = fs.readFileSync(
                        challenge_path + "/description.md",
                        "utf8"
                    );
                    let template = fs.readFileSync(
                        challenge_path + "/template.js",
                        "utf8"
                    );
                    let test = fs.readFileSync(
                        challenge_path + "/template.test.js",
                        "utf8"
                    );
                    let solution = fs.readFileSync(
                        challenge_path + "/solution.md",
                        "utf8"
                    );

                    description = Buffer.from(description).toString("base64");
                    template = Buffer.from(template).toString("base64");
                    test = Buffer.from(test).toString("base64");
                    solution = Buffer.from(solution).toString("base64");
                    db.addChallenge(
                        challenge_dir,
                        description,
                        template,
                        test,
                        solution,
                        level
                    );
                });
            });
        });
    });
}

load_challenges();

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

var download = (req, res, next) => {
    if (req.body.imageurl) {
        var name = req.body.imageurl.substring(
            req.body.imageurl.lastIndexOf("/") + 1
        );
        var path = __dirname + "/uploads/" + name;
        const file = fs.createWriteStream(path);
        http.get(req.body.imageurl, function(response) {
            response
                .on("data", function(data) {
                    file.write(data);
                })
                .on("end", function() {
                    req.file = {
                        path: path,
                        size: response.headers["content-length"],
                        mimetype: response.headers["content-type"],
                        filename: name
                    };
                    file.end();
                    next();
                });
        });
    } else {
        next();
    }
};

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        const imageUrl = config.s3Url + req.file.filename;
        db.getUserById(req.session.userId).then(data => {
            console.log(data.rows[0].profile_pic);
            if (data.rows[0].profile_pic) {
                s3.delete(data.rows[0].profile_pic);
            }
        });
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

app.post("/image-post", download, s3.upload, function(req, res) {
    if (req.file && req.session.userId) {
        const url = config.s3Url + req.file.filename;
        db.postImage(
            req.session.userId,
            req.body.challenge_id ? req.body.challenge_id : null,
            req.body.parent_post_id,
            url
        )
            .then(vals => {
                res.json(vals.rows[0]);
            })
            .catch(err => {
                console.log("Error in posting image: ", err);
                res.status(500).json();
            });
    } else {
        console.log("Error in posting image: ");
        res.status(500).json();
    }
});

app.post("/comment-post", async (req, res) => {
    if (req.body.comment && req.session.userId) {
        let parent_post_id = req.body.parent_post_id
            ? req.body.parent_post_id
            : 0;
        db.postText(
            req.session.userId,
            req.body.challenge_id ? req.body.challenge_id : null,
            parent_post_id,
            req.body.comment
        )
            .then(vals => {
                res.json(vals.rows[0]);
            })
            .catch(err => {
                console.log("Error in posting comments: ", err);
                res.status(500).json();
            });
    } else {
        console.log("Error in posting comments: ");
        res.status(500).json();
    }
});

app.post("/deletepost", (req, res) => {
    db.deletePost(req.body.id)
        .then(() => {
            console.log("delete post");
            res.status(200).json();
        })
        .catch(err => {
            console.log("Error in deleting post ", err);
            res.status(500).json();
        });
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

app.get("/api/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let posts = await db.getPosts(
            id != 0 ? id : null,
            req.query.parent_post_id
        );
        res.json({
            posts: posts.rows
        });
    } catch (err) {
        console.log("Error Message: ", err);
        res.status(500).json();
    }
});

// Part 7
app.post("/api/user/:id", async (req, res) => {
    try {
        let friendshipStatus;
        const { id } = req.params;
        let action = req.body.action;
        let receiver_id = id;
        let sender_id = req.session.userId;
        let invitationChange = false;
        if (action == "send") {
            friendshipStatus = await db.makeFriendship(sender_id, receiver_id);
            invitationChange = true;
        } else if (action == "cancel") {
            friendshipStatus = await db.cancelFriendship(
                sender_id,
                receiver_id
            );
            invitationChange = true;
        } else if (action == "accept") {
            friendshipStatus = await db.acceptFriendship(
                receiver_id,
                sender_id
            );
            invitationChange = true;
        } else if (action == "end") {
            friendshipStatus = await db.endFriendship(sender_id, receiver_id);
        }

        //Friend Request Notifications
        if (invitationChange) {
            let notify_id = action == "accept" ? sender_id : receiver_id;
            let request_count = await db.getFriendRequestCount(notify_id);

            for (let [key, value] of Object.entries(onlineUsers)) {
                if (value == parseInt(notify_id)) {
                    console.log(request_count.rows[0]);
                    io.to(`${key}`).emit(
                        "friendrequest",
                        request_count.rows[0]
                    );
                }
            }
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
    var email = /^\w+@[a-z0-9A-Z_]+?\.[a-z0-9A-Z]{2,3}$/;
    var first = req.body.first ? req.body.first : "";
    var last = req.body.last ? req.body.last : "";
    console.log(alphanum.test(String(first.value).toLowerCase()));
    console.log(alphanum.test(String(last.value).toLowerCase()));
    console.log(email.test(String(req.body.email).toLowerCase()));
    console.log(req.body.pwd);
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
    for (let [key, value] of Object.entries(onlineUsers)) {
        if (value == req.session.userId) {
            console.log(key, "  ", value);
            delete onlineUsers[key];
        }
    }
    req.session = null;
    res.redirect("/");
});

app.get("/delete", (req, res) => {
    db.getUserById(req.session.userId).then(data => {
        console.log(data.rows[0].profile_pic);
        if (data.rows[0].profile_pic) {
            s3.delete(data.rows[0].profile_pic);
        }
        db.deleteUser(req.session.userId)
            .then(() => {
                req.session = null;
                res.redirect("/");
            })
            .catch(err => {
                console.log("Error in deleting user ", err);
                req.session = null;
                res.redirect("/");
            });
    });
});

app.get("/api/challenges", (req, res) => {
    let promise;
    if (req.query.level != -1) {
        promise = db.getChallengesByLevel(req.query.level);
    } else {
        promise = db.getAllChallenges();
    }
    promise
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("Error in listing challenges ", err);
            res.status(500).json();
        });
});

app.get("/api/challenge", (req, res) => {
    const id = req.query.id;
    db.getChallengeById(id)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log("Error in fetching challenge ", err);
            res.status(500).json();
        });
});

app.post("/api/challenge", (req, res) => {
    db.getChallengeById(req.body.id)
        .then(data => {
            let challenge = data.rows[0];
            let solution = Buffer.from(req.body.solution, "base64").toString(
                "utf8"
            );
            let solution_path = "./uploads/" + req.session.userId;
            let solution_file = solution_path + "/template.js";
            fs.mkdir(solution_path, function(e) {
                if (!e || (e && e.code === "EEXIST")) {
                    fs.writeFile(solution_file, solution, function(err) {
                        if (err) {
                            res.status(500).json();
                            return console.error(err);
                        }

                        const test_target = solution_path + "/verify.test.js";
                        const test = Buffer.from(
                            challenge.test,
                            "base64"
                        ).toString("utf8");
                        fs.writeFile(test_target, test, err => {
                            if (err) {
                                res.status(500).json();
                                return console.error(err);
                            }

                            const options = {
                                projects: [solution_path],
                                testMatch: [
                                    "**/uploads/" +
                                        req.session.userId +
                                        "/verify.test.js"
                                ],
                                silent: true
                            };

                            jest.runCLI(options, options.projects)
                                .then(status => {
                                    if (status.results.numFailedTests == 0) {
                                        // Add to score and store solution
                                    }

                                    res.status(200).json({
                                        testResults:
                                            status.results.testResults[0]
                                                .testResults,
                                        numFailedTests:
                                            status.results.numFailedTests,
                                        numPassedTests:
                                            status.results.numPassedTests
                                    });
                                    fs.unlink(test_target, () => {});
                                    fs.unlink(solution_file, () => {});
                                    fs.rmdir(solution_path, () => {});
                                })
                                .catch(failure => {
                                    console.error("Error ", failure);
                                    res.status(500).json();
                                });
                        });
                    });
                } else {
                    res.status(500).json();
                    return console.log(e);
                }
            });
        })
        .catch(err => {
            console.log("Error in executing challenge ", err);
            res.status(500).json();
        });
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

io.on("connection", socket => {
    console.log(`A socket with the id ${socket.id} just connected.`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let userId = socket.request.session.userId;
    onlineUsers[socket.id] = userId;

    console.log(onlineUsers);
    db.getUsersById(Object.values(onlineUsers))
        .then(users => {
            io.emit("onlineusers", users.rows);
        })
        .catch(err => {
            console.log("Error in getting user. ", err);
        });

    db.getFriendRequestCount(userId)
        .then(data => {
            socket.emit("friendrequest", data.rows[0]);
        })
        .catch(err => {
            console.log("Error in getting friend request count. ", err);
        });

    // //part1: is getting the recent 10 messages.
    db.getRecentChatMessages()
        .then(data => {
            socket.emit("chatMessages", data.rows);
        })
        .catch(err => {
            console.log("Error in getting chat messages. ", err);
        });
    //part-2: dealing with a new chat message
    socket.on("message", function(newMessage) {
        console.log("This is the new chat message", newMessage);
        //figure out who sent message.
        //then make a db query to get info about that user.
        db.getUserById(userId)
            .then(message => {
                //then -> create a new message Object that matches the objects in the last 10 chat messages.
                //const newMsg = { ...message, newMessage };
                //emit that there is a new chat and pass the object.
                //add this chat message to our Database.
                db.addChatMessage(userId, newMessage).then(() => {
                    db.getRecentChatMessages()
                        .then(data => {
                            socket.emit("chatMessages", data.rows);
                        })
                        .catch(err => {
                            console.log(
                                "Error in getting chat messages. ",
                                err
                            );
                        });
                });
            })
            .catch(err => {
                console.log("Error in saving chat message. ", err);
            });
    });

    socket.on("disconnect", () => {
        onlineUsers.delete(socket.id);
        db.getUsersById(Object.values(onlineUsers))
            .then(users => {
                io.emit("onlineusers", users.rows);
            })
            .catch(err => {
                console.log("Error in getting user. ", err);
            });

        console.log(`A socket with the id ${socket.id} just disconnected.`);
    });
});
