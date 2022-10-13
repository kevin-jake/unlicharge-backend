const AWS = require("aws-sdk");
// store each image in it's own unique folder to avoid name duplicates
// load config data from .env file
require("dotenv").config();
// update AWS config env data
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

// my default params for s3 upload
// I have a max upload size of 1 MB
const s3DefaultParams = {
  ACL: "public-read",
  Bucket: process.env.AWS_S3_BUCKET,
  Conditions: [
    ["content-length-range", 0, 1024000], // 1 Mb
    { acl: "public-read" },
  ],
};

// the actual upload happens here
const handleFileUpload = async (file, user) => {
  const { createReadStream, filename } = await file;

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        ...s3DefaultParams,
        Body: createReadStream(),
        Key: `${user.username + "-" + user.id}/${filename}`,
      },
      (err, data) => {
        if (err) {
          console.log("error uploading...", err);
          reject(err);
        } else {
          console.log("successfully uploaded file...", data);
          resolve(data);
        }
      }
    );
  });
};

module.exports = { handleFileUpload };
