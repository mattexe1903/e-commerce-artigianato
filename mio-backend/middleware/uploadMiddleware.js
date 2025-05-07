const multer = require('multer');
const path = require('path');

// Configurazione di Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Salva le immagini nella cartella 'images/'
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    // Rinomina il file in base all'ID del prodotto per renderlo univoco
    const productId = req.body.productId || 'unknown'; // Assuming you pass productId in the body for the file
    const extname = path.extname(file.originalname); // Ottieni l'estensione del file (e.g., .jpg, .png)
    cb(null, `${productId}${extname}`);
  }
});

// Funzione di filtraggio per permettere solo determinati tipi di file (es. immagini)
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

// Middleware per l'upload dell'immagine
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limita la dimensione a 10MB
});

module.exports = upload;
