import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();

const BUCKET = process.env.BUCKET;
const REGION = process.env.AWS_REGION;
const API_URL = `${process.env.API_URL}`;

const config = {
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s3 = new S3Client(config);

// TODO: Use tinypng to compress images
export const uploadToS3 = async ({ file, user }) => {
  let key = `${user?.username}/${file.originalname}`;
  let objectExists = false;

  try {
    const headCommand = new HeadObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const result = await s3.send(headCommand);
    objectExists = result ? true : false;
  } catch (error) {}

  if (objectExists) {
    let count = 1;
    const originalKey = key;
    while (objectExists) {
      const extension = originalKey.split(".").pop();
      key = `${user?.username}/${
        originalKey.split(".")[0].split("/")[1]
      }-${count}.${extension}`;
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: BUCKET,
          Key: key,
        });

        const result = await s3.send(headCommand);
        objectExists = result ? true : false;
        count += 1;
      } catch (error) {
        console.log(`Renaming file from ${file.originalname} to ${key}`);
        objectExists = false;
      }
    }
  }

  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });

  try {
    await s3.send(uploadCommand);
    const url = `${API_URL}/image/${key}`;
    return url;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const getImage = async (req, res) => {
  const { key } = req.params;
  const decodedKey = decodeURIComponent(key);
  const getObjectCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: decodedKey,
  });

  try {
    const object = await s3.send(getObjectCommand);
    const stream = object.Body;
    res.setHeader("Content-Type", object.ContentType);
    res.setHeader("Content-Length", object.ContentLength);
    res.setHeader("Content-Disposition", `inline; filename="${key}"`);
    stream.pipe(res);
  } catch (error) {
    console.log(
      `[${moment().format()}]-[S3 ERROR] Code: ${
        error.httpStatusCode
      } message: ${error.Code}: ${error.message}`
    );
    res.status(404).send(`Object not found for key ${key}`);
  }
};
