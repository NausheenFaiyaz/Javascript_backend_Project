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
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temp file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (fileURL) => {
  if (!fileURL) return;

  try {
    // Extract public_id from URL
    const publicId = fileURL.split("/").pop().split(".")[0];
    
    let resourceType="image";

   if (
      fileURL.includes(".mp4") ||
      fileURL.includes(".mov") ||
      fileURL.includes(".avi") ||
      fileURL.includes(".mkv")
    ) {
      resourceType = "video";
    }

    // Delete the asset
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
