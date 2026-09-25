import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Verify Cloudinary environment keys at runtime
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('CRITICAL ERROR: Cloudinary environment variables are missing from process.env');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a buffer stream to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from Multer memoryStorage
 * @param {string} folder - Destination folder name in Cloudinary
 * @returns {Promise<string>} - Resolves with the secure_url of the uploaded image
 */
export const uploadToCloudinary = (fileBuffer, folder = 'topline_apartments') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream error:', error);
          return reject(error);
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary response did not return a valid secure_url.'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Extracts public_id from Cloudinary URL and deletes the asset
 * @param {string} url - Full Cloudinary image URL
 */
export const deleteFromCloudinary = async (url) => {
  try {
    if (!url || typeof url !== 'string') return;

    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return;

    const folderAndFile = parts.slice(uploadIndex + 1).filter((p) => !p.startsWith('v'));
    const pathWithExt = folderAndFile.join('/');
    const publicId = pathWithExt.substring(0, pathWithExt.lastIndexOf('.'));

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error('Failed to delete Cloudinary asset:', err);
  }
};

export default cloudinary;