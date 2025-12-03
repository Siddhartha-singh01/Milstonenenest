const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Local storage configuration
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
};

// Multer configuration
const upload = multer({
    storage: localStorage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
    },
    fileFilter: fileFilter
});

// AWS S3 configuration (for production)
// AWS S3 configuration (for production)
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const uploadToS3 = async (file) => {
    const fileContent = fs.readFileSync(file.path);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}-${file.originalname}`,
        Body: fileContent,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    try {
        const upload = new Upload({
            client: s3,
            params: params
        });

        const data = await upload.done();
        // Delete local file after successful S3 upload
        fs.unlinkSync(file.path);
        return data.Location;
    } catch (error) {
        throw new Error(`S3 upload failed: ${error.message}`);
    }
};

const deleteFromS3 = async (fileUrl) => {
    const key = fileUrl.split('.com/')[1];

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    };

    try {
        await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
        throw new Error(`S3 delete failed: ${error.message}`);
    }
};

module.exports = {
    upload,
    uploadToS3,
    deleteFromS3,
    uploadDir
};
