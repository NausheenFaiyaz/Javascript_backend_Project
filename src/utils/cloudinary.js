import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully

    // console.log("Fie is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temp file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (fileURL) => {
  try {
    if (!fileURL) return null;

    // Extract public_id from the Cloudinary URL
    const parts = fileURL.split("/");
    const fileWithExt = parts.pop();       
    const publicId = fileWithExt.split(".")[0];

    const folderPath = parts.slice(parts.indexOf("upload") + 1).join("/");

    const fullPublicId = folderPath
      ? `${folderPath}/${publicId}`
      : publicId;

    // Delete from Cloudinary
    const response = await cloudinary.uploader.destroy(fullPublicId);

    return response;
  } catch (error) {
    console.log("Cloudinary deletion error:", error);
    return null;
  }
}

  export {uploadOnCloudinary, deleteOnCloudinary}