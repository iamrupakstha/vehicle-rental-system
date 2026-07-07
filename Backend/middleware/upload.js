import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

//configure storage
const storage = multer.diskStorage({
  //destination folder
  destination: (req, filename, cb) => {
      const uploadPath = path.join(_dirname, '../uploads');
      cb(null, uploadPath);
  },


  //filename
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'screenshot-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// FILE FILTER

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  
  // Check extension
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  
  // Check mimetype
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error(' Only images are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// CREATE MULTER INSTANCE
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

export default upload;