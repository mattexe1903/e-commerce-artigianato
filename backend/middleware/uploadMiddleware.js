const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imagesDir = path.join(__dirname, '..', 'images');
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const productId = req.body.productId || 'placeholder';
    const extname = path.extname(file.originalname);
    cb(null, `${productId}${extname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('File non supportato. Solo immagini .jpg, .jpeg, .png sono permessi.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;
