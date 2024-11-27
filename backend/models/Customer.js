const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Customer', CustomerSchema);
