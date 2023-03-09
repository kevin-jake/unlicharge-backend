import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
  const key = `${user?.username || "test"}(${user?.userId})/${
    file.originalname
  }`;
  // const key = "test";

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
