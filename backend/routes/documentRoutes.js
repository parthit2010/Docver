const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentByOwnerId,
} = require('../controllers/documentController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1597922269473.pdf
  },
});

const upload = multer({ storage });

// Routes
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.get('/getDocumentByOwnerId/:id', getDocumentByOwnerId);
router.post('/', upload.single('file'), createDocument);
router.put('/:id', upload.single('file'), updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
