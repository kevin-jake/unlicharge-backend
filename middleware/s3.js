import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const BUCKET = process.env.BUCKET;
const REGION = process.env.AWS_REGION;
const config = {
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s3 = new S3Client(config);

export const uploadToS3 = async ({ file, user }) => {
  let key = `${user?.username}/${file.originalname}`;
  // const key = "test";

  let suffix = "";
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
    // If the object already exists in the bucket, add a numbered suffix to the filename
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
    const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
    return url;
  } catch (error) {
    console.log(error);
    return { error };
  }
};
