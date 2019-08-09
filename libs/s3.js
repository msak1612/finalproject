const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = (req, res, next) => {
    const { file } = req;
    if (!file) {
        console.log("Multer failed :");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    console.log("S3: ", req.file);

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
        .promise()
        .then(data => {
            console.log("Put Success", data);
            next();
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
        .then(() => fs.unlink(path, () => {}));
};

exports.delete = file => {
    console.log("S3 delete: ", file);

    var filename = path.basename(file);
    s3.deleteObject({
        Bucket: "spicedling",
        Key: filename
    })
        .promise()
        .then(data => {
            console.log("Delete Success", data);
        })
        .catch(err => {
            console.log(err);
        });
};
