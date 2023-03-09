import { uploadToS3 } from "../middleware/s3.js";

export const uploadPhoto = async (req, res, next) => {
  const { file, user } = req;
  if (!file) return res.status(400).json({ message: "Bad request" });
  if (!user && !req.body.username)
    return res
      .status(400)
      .json({ message: "Username is required. Before uploading a photo" });

  const response = await uploadToS3({ file, user: user || req.body });

  return res.status(201).json(response);
};
