const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  hashkey: {
    type: String,
  },
  type: {
    type: String,
  },
  ownerId:{
    type: String,
  },
  file: {
    type: String, // Store the file path or URL
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Document', DocumentSchema);
