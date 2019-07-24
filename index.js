const express = require("express");
const app = express();
const compression = require("compression");

app.use(compression());

app.use(require('cookie-session'){

}

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

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect('/')
    }
    else {
        res.sendfile(__dirname + '/index.html')
    }
});

app.get("/register", (req, res) => {

})

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome')
    }
    else {
        res.sendfile(__dirname + '/index.html')
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
