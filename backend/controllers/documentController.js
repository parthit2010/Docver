const Document = require('../models/Document');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Public
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    get Documents by Owner ID
// @route   GET /api/documents/getDocumentByOwnerId/:id
// @access  Public
const getDocumentByOwnerId = async (req, res) => {
  try {
      const ownerId = req.params.id;  
      console.log(req.params.id);
      // Validate input
      if (!ownerId) {
          return res.status(400).json({status: false, message: 'OwnerId required' });
      }

      // Fetch the customer by username
      const documents = await Document.find({ ownerId });

      if (documents.length === 0) {
          return res.status(404).json({ status: false, message: 'Document not found' });
      }
      res.json(documents);
     
  } catch (error) {
      console.error('Error in document:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Create a new document
// @route   POST /api/documents
// @access  Public
const createDocument = async (req, res) => {
  const { name, description, hashkey, type, ownerId } = req.body;
  const file = req.file ? req.file.path : null;
  const status = "Pending";
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const newDocument = new Document({
      name,
      description,
      status,
      hashkey,
      type,
      ownerId,
      file,
    });
    console.log("Create Document with " + ownerId );
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Public
const updateDocument = async (req, res) => {
  const { name, description, status, hashkey } = req.body;
  const file = req.file ? req.file.path : null;

  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    document.name = name || document.name;
    document.description = description || document.description;
    document.status = status || document.status;
    document.hashkey = hashkey || document.hashkey;
    if (file) document.file = file;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Public
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    await document.deleteOne();
    res.json({ message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDocuments,
  getDocumentById,
  getDocumentByOwnerId,
  createDocument,
  updateDocument,
  deleteDocument,
};
