// routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Upload Error:", err); // 👈 log this
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
