// utils/upload.js (hoặc uploadS3.js nếu bạn giữ nguyên tên file)
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const log4js = require('log4js');
const logger = log4js.getLogger();

// Khởi tạo client S3
const s3 = new S3Client({
    region: process.env.AWS_S3_REGION, // Nên đọc từ biến môi trường
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    },
});

/**
 * Uploads a base64 image string to S3.
 * @param {string} base64String - The base64 encoded image string (e.g., "data:image/png;base64,...").
 * @param {string} [uploadDir='avatars'] - The directory inside the S3 bucket to upload to.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
const uploadImageFromBase64 = async (base64String, uploadDir = 'avatars') => { // Thêm uploadDir
    logger.info('Starting image upload from base64 string');
    if (!base64String || typeof base64String !== 'string') {
        logger.error('Invalid base64 string provided.');
        throw new Error('Invalid base64 string.');
    }

    // Parse mime type và data từ base64
    const matches = base64String.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
        logger.error('Invalid base64 image format.');
        throw new Error('Invalid base64 image format. Expected "data:image/<type>;base64,..."');
    }

    const mimeType = matches[1]; // ví dụ image/png
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Xác định phần mở rộng ảnh từ mimeType
    const extension = mimeType.split('/')[1];
    // Đảm bảo uploadDir không có dấu '/' ở cuối để tránh lỗi đường dẫn
    const sanitizedUploadDir = uploadDir.endsWith('/') ? uploadDir.slice(0, -1) : uploadDir;
    const key = `${sanitizedUploadDir}/${uuidv4()}.${extension}`; // Ví dụ: avatars/abc123.png

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentEncoding: 'base64', // Đây là mã hóa của Body, không phải Content-Type
        ContentType: mimeType,     // Đây là loại nội dung của file
        // Bỏ DÒNG NÀY ĐI: ACL: 'public-read', 
    });

    logger.info(`Uploading image to S3 with key: ${key}`);
    try {
        await s3.send(command);
        logger.info(`Image uploaded successfully to S3: ${key}`);
        // Trả về URL ảnh đã upload
        // Đảm bảo AWS_S3_URL của bạn trỏ tới bucket public endpoint
        return `${process.env.AWS_S3_URL}/${key}`; 
    } catch (error) {
        logger.error(`Error uploading image to S3: ${error.message}`);
        throw new Error(`Failed to upload image to S3: ${error.message}`);
    }
};

module.exports = { uploadImageFromBase64 };