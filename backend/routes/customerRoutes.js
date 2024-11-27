const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
  registerCustomer,
} = require('../controllers/customerController');

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Ensure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1597922269473.pdf
//   },
// });

// const upload = multer({ storage });

// Routes
router.get('/', getCustomers);
router.post('/login', loginCustomer);
router.post('/register', registerCustomer);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
