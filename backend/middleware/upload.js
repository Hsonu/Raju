const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Multer memory storage (we upload to Cloudinary, not local disk)
const storage = multer.memoryStorage();

// File filter — only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed'), false);
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10,
  },
});

// Upload buffer to Cloudinary with safe fallback
const uploadToCloudinary = (buffer, folder = 'riddhi-computer') => {
  return new Promise((resolve) => {
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === '123456789012345' || process.env.CLOUDINARY_CLOUD_NAME === 'demo') {
      // Local development fallback to Base64 data URI
      const base64 = buffer.toString('base64');
      return resolve({
        url: `data:image/jpeg;base64,${base64}`,
        publicId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.warn('Cloudinary upload failed, falling back to base64 data URI:', error.message);
          const base64 = buffer.toString('base64');
          resolve({
            url: `data:image/jpeg;base64,${base64}`,
            publicId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          });
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
