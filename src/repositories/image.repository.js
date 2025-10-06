const { getCloudinary } = require("../services/cloudinary.client");

const buildPublicId = (userId) => `users/${userId}/avatar`;

const saveImage = async (userId, image) => {
    const cloudinary = getCloudinary();
    const public_id = buildPublicId(userId);
    
    let uploadSource;
    
    // Check if it's already a URL (http/https or data URL)
    if (/^(data:|https?:\/\/)/i.test(image)) {
        uploadSource = image;
    } else {
        // For raw base64, create data URL and upload
        const trimmed = String(image).replace(/\s+/g, '');
        let mime = 'image/jpeg'; // default
        if (trimmed.startsWith('iVBORw0')) mime = 'image/png';
        else if (trimmed.startsWith('R0lGOD')) mime = 'image/gif';
        else if (trimmed.startsWith('UklGR')) mime = 'image/webp';
        
        uploadSource = `data:${mime};base64,${trimmed}`;
    }
    
    // Upload with minimal parameters to avoid signature issues
    const result = await cloudinary.uploader.upload(uploadSource, {
        public_id,
        overwrite: true
    });
    
    return result.secure_url;
};  

const getCachedImage = async (userId) => {
    const cloudinary = getCloudinary();
    const public_id = buildPublicId(userId);
    
    // First check if the image exists
    try {
        await cloudinary.api.resource(public_id, { resource_type: 'image' });
    } catch (error) {
        // Image doesn't exist
        return null;
    }
    
    // Generate a transformation URL for consistent sizing
    return cloudinary.url(public_id, {
        secure: true,
        transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { radius: 'max' },
            { quality: 'auto', fetch_format: 'auto' }
        ]
    });
};

const deleteImageByUserId = async (userId) => {
    const cloudinary = getCloudinary();
    const public_id = buildPublicId(userId);
    try {
        await cloudinary.uploader.destroy(public_id, { resource_type: 'image', invalidate: true });
    } catch (_) {}
};

module.exports = {
    saveImage,
    getCachedImage,
    deleteImageByUserId
};