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
const YAML = require("yaml");
const removeMd = require("remove-markdown");

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

async function load_challenges() {
    const root_dir = path.join(__dirname, "challenges");
    const files = fs.readdirSync(root_dir);
    let challenges = [];
    let challenge_id = 1;
    files.sort(function(a, b) {
        return (
            fs.statSync(root_dir + "/" + a).birthtime.getTime() -
            fs.statSync(root_dir + "/" + b).birthtime.getTime()
        );
    });
    console.log(files);
    files.forEach(function(file) {
        const challenge_path = path.join(root_dir, file);
        const contents = fs.readFileSync(challenge_path, "utf8");
        const info = YAML.parse(contents);
        const description = Buffer.from(info.description).toString("base64");
        const template = Buffer.from(info.template).toString("base64");
        const test = Buffer.from(info.test).toString("base64");
        const solution = Buffer.from(info.solution).toString("base64");
        let preview = removeMd(info.description);
        preview = preview.replace(/(\r\n|\n|\r|\'|\"|`)/gm, " ");
        const preview_len = 200;
        if (preview.length > preview_len) {
            preview = preview.substr(0, preview_len - 3) + "...";
        }
        challenges.push([
            challenge_id,
            info.name,
            preview,
            description,
            template,
            test,
            solution,
            info.level,
            info.tags
        ]);
        challenge_id++;
    });
    const result = await db.addChallenges(challenges);
    console.log("Have " + result.rowCount + " Challenges");
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
    if (req.session.userId && req.file && req.body.has_spoilers != null) {
        const url = config.s3Url + req.file.filename;
        db.postImage(
            req.session.userId,
            req.body.challenge_id ? req.body.challenge_id : null,
            req.body.parent_post_id,
            url,
            req.body.has_spoilers
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
    if (
        req.session.userId &&
        req.body.comment &&
        req.body.has_spoilers != null
    ) {
        let parent_post_id = req.body.parent_post_id
            ? req.body.parent_post_id
            : 0;
        db.postText(
            req.session.userId,
            req.body.challenge_id ? req.body.challenge_id : null,
            parent_post_id,
            req.body.comment,
            req.body.has_spoilers
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
                    io.to(`${key}`).emit(
                        "friendRequest",
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
    } else if (req.query.tag != null && req.query.tag.length > 0) {
        promise = db.getChallengesByTag(req.query.tag);
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

app.get("/api/challenges/classifiers", (req, res) => {
    db.getChallengeClassifiers()
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log("Error in listing challenges ", err);
            res.status(500).json();
        });
});

app.get("/api/collections", (req, res) => {
    let promise;
    if (req.query.creator_id > 0) {
        promise = db.getCollectionsByCreator(req.query.creator_id);
    } else {
        promise = db.getAllCollections();
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

app.post("/api/collections", (req, res) => {
    if (req.body.challenge_id != null && req.body.collection_id != null) {
        db.getCollectionById(req.body.collection_id)
            .then(data => {
                let promise;
                if (req.body.action === "delete") {
                    if (
                        data.rowCount != 1 ||
                        data.rows[0].creator != req.session.userId
                    ) {
                        return res.json(500).json();
                    }
                    promise = db.deleteFromCollection(
                        req.body.collection_id,
                        req.body.challenge_id
                    );
                } else {
                    promise = db.addToCollection(
                        req.body.collection_id,
                        req.body.challenge_id
                    );
                }
                promise
                    .then(data => {
                        res.json(data.rows);
                    })
                    .catch(err => {
                        console.log("Error in listing challenges ", err);
                        res.status(500).json();
                    });
            })
            .catch(err => {
                console.log("Error in fetching collection ", err);
                res.status(500).json();
            });
    } else {
        let promise;

        if (req.body.action === "delete") {
            promise = db.deleteCollection(req.body.collection_id);
        } else {
            promise = db.addCollection(
                req.body.name,
                req.session.userId,
                req.body.description
            );
        }

        promise
            .then(data => {
                res.json(data.rows);
            })
            .catch(err => {
                console.log("Error in listing challenges ", err);
                res.status(500).json();
            });
    }
});

app.get("/api/collection", (req, res) => {
    const id = req.query.id;
    db.getCollectionById(id)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log("Error in fetching collection ", err);
            res.status(500).json();
        });
});

app.get("/api/solutions", (req, res) => {
    let promise;
    if (req.query.creator_id > 0) {
        promise = db.getSolutionsByUser(req.query.creator_id);
    } else if (req.query.challenge_id > 0) {
        promise = db.getSolutionsForChallenge(req.query.challenge_id);
    } else {
        return res.status(500).json();
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

app.post("/api/solution", (req, res) => {
    db.unlockSolution(req.session.userId, req.body.challenge_id)
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
    db.getChallengeById(id, req.session.userId)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log("Error in fetching challenge ", err);
            res.status(500).json();
        });
});

app.post("/api/challenge", (req, res) => {
    let solution_path = "./uploads/" + req.session.userId;
    let solution_file = solution_path + "/template.js";
    let test_target = solution_path + "/verify.test.js";
    let challenge;
    let results;

    db.getChallengeById(req.body.id, req.session.userId)
        .then(data => {
            challenge = data.rows[0];
            if (!fs.existsSync(solution_path)) {
                return fs.promises.mkdir(solution_path);
            } else {
                return Promise.resolve();
            }
        })
        .then(data => {
            const solution = Buffer.from(req.body.solution, "base64").toString(
                "utf8"
            );
            return fs.promises.writeFile(solution_file, solution);
        })
        .then(data => {
            const test = Buffer.from(challenge.test, "base64").toString("utf8");
            return fs.promises.writeFile(test_target, test);
        })
        .then(data => {
            const options = {
                projects: [solution_path],
                testMatch: ["**/" + test_target.substr(2)],
                silent: true
            };

            return jest.runCLI(options, options.projects);
        })
        .then(status => {
            results = status.results;
            if (
                parseInt(challenge.unlocked) === 0 &&
                status.results.numFailedTests == 0
            ) {
                return db.addSolution(
                    req.session.userId,
                    req.body.id,
                    req.body.solution
                );
            } else {
                return Promise.resolve();
            }
        })
        .then(data => {
            if (data && data.rowCount != 0) {
                let score = (challenge.level + 1) * 10;
                return db.incrementScore(req.session.userId, score);
            } else {
                return db.getUserById(req.session.userId);
            }
        })
        .then(data => {
            let score = data.rows[0].score;
            if (score % 50 === 0) {
                for (let [key, value] of Object.entries(onlineUsers)) {
                    if (value == parseInt(req.session.userId)) {
                        io.to(`${key}`).emit("gainedScore", score);
                    }
                }
            }
            res.status(200).json({
                testResults: results.testResults[0].testResults,
                numFailedTests: results.numFailedTests,
                numPassedTests: results.numPassedTests,
                score: score
            });
        })
        .catch(failure => {
            console.log("Error: ", failure);
            res.status(500).json();
        })
        .finally(() => {
            fs.unlink(test_target, () => {});
            fs.unlink(solution_file, () => {});
            fs.rmdir(solution_path, () => {});
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
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let userId = socket.request.session.userId;
    onlineUsers[socket.id] = userId;

    db.getUsersById(Object.values(onlineUsers))
        .then(users => {
            io.emit("onlineUsers", users.rows);
        })
        .catch(err => {
            console.log("Error in getting user. ", err);
        });

    console.log(socket.id);
    db.getFriendRequestCount(userId)
        .then(data => {
            socket.emit("friendRequest", data.rows[0]);
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
                io.emit("onlineUsers", users.rows);
            })
            .catch(err => {
                console.log("Error in getting user. ", err);
            });
    });
});
