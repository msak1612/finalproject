const express = require("express");
const app = express();
const compression = require("compression");
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
    console.log("req.session.userId: ", req.session.userId);
    try {
        const user = await db.getUserById(req.session.userId);
        if (!user.profile_pic) {
            user.profile_pic = "/images/default.png";
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.log("Error Message: ", err);
    }
});

app.get("/api/user/:id", async (req, res) => {
    console.log("req.params: ", req.params);
    try {
        const { id } = req.params;
        console.log("ID: ", id);
        const user = await db.getUserById(id);
        if (!user.profile_pic) {
            user.profile_pic = "/images/default.png";
        }
        res.json({ user: user.rows[0], sameUser: req.session.userId == id });
    } catch (err) {
        console.log("Error Message: ", err);
    }
}); //url should be different than in BR

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// POST /register with async
app.post("/register", async (req, res) => {
    try {
        let buff = Buffer.from(req.body.pwd, "base64");
        let text = buff.toString("ascii");
        let securedPwd = await bc.hashPassword(text);
        let user = await db.addUser(
            req.body.first,
            req.body.last,
            securedPwd,
            req.body.email
        );
        req.session.userId = user.rows[0].id;
        res.json({ success: true });
    } catch (err) {
        console.log("Error in POST /registration: ", err);
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
                res.json({ success: true });
            } else {
                return Promise.reject();
            }
        }, userInfo)
        .catch(err => {
            console.log("Error in POST /login: ", err);
            res.json({ success: false });
        });
});

app.post("/bio", (req, res) => {
    console.log("req.body: ", req.body);
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
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("Server is Running at localhost:8080")
    );
}
