const { v2: cloudinary } = require('cloudinary');

let isConfigured = false;

const getCloudinary = () => {
  if (isConfigured) return cloudinary;

  const url = process.env.CLOUDINARY_URL;
  if (!url) {
    throw new Error('Missing CLOUDINARY_URL env var');
  }

  // Trim accidental quotes/whitespace
  const sanitized = url.trim().replace(/^['"]|['"]$/g, '');
  if (sanitized !== url) process.env.CLOUDINARY_URL = sanitized;

  // Let SDK read CLOUDINARY_URL from env; enforce secure delivery
  cloudinary.config({ secure: true });
  isConfigured = true;
  return cloudinary;
}

module.exports = {
  getCloudinary
};


