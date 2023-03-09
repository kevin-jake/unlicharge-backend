import { uploadToS3 } from "../middleware/s3.js";

export const uploadPhoto = async (req, res, next) => {
  const { file, user } = req;
  console.log("🚀 ~ file: upload.js:5 ~ uploadPhoto ~ file:", file);

  if (!file) return res.status(400).json({ message: "Bad request" });

  const response = await uploadToS3({ file, user });
  console.log("🚀 ~ file: upload.js:9 ~ uploadPhoto ~ response:", response);
  // if (error) return res.status(500).json({ message: error.message });

  return res.status(201).json(response);
};
