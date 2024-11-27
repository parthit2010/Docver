import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
 } from '@mui/material';
import axios from 'axios';
import { Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [documents, setDocuments] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
//  const [fileHash, setFileHash] = useState(null);

console.log("Token " + token);

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};

const fetchCustomer = async() => {

  try {
    const customerRes = await axios.get(`http://localhost:3000/api/customers/${token}`);
    //return { ...doc, customerName: customerRes.data.username }; // Assuming customer API returns a `name` field
    setCustomerName(customerRes.data.username);
  } catch (error) {
    console.error(`Error fetching customer for ownerId`, error);
   // return { ...doc, customerName: "Unknown" }; // Handle missing customer gracefully
  }

}

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/documents/getDocumentByOwnerId/'+token);
      console.log(res.data);
      const customerDocuments = res.data.filter(doc => doc.type === 'customer');
      setDocuments(customerDocuments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`http://localhost:3000/api/documents/${id}`);
        setDocuments(documents.filter(doc => doc._id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchDocuments();
  }, []);

  const generateHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer); // Generate SHA-256 hash
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert hash buffer to byte array
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
};


  // Fetch documents (mocked data or real API call)
  useEffect(() => {
    // Fetch user's uploaded documents from the backend
    // For now, we're using hardcoded data
    // setDocuments([
    //   { name: 'Certificate', description: 'Description of Certificate', status: 'Pending' },
    //   { name: 'Passport', description: 'Passport document', status: 'Approved' },
    //   { name: 'ID Card', description: 'ID document', status: 'Rejected' },
    // ]);
  }, []);



  const handleUpload = async(e) => {
    e.preventDefault();
    // API call to upload the document

    if (!name) {
      alert('Name is required');
      return;
    }

    if (!file) {
      alert('File is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', 'customer');
    formData.append('ownerId', token);
    console.log("token " + token);
    if (file) formData.append('file', file);

    try {
      setLoading(true);
       // Function to generate SHA-256 hash of the file
       try {
        const hash = await generateHash(file);
       // setFileHash(hash);
        formData.append('hashkey', hash); // Include the hash
        console.log(formData);
    } catch (error) {
        console.error('Error generating file hash:', error);
        alert('Failed to generate hash. Please try again.');
    }
    await axios.post('http://localhost:3000/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });

      setLoading(false);
      fetchDocuments();
      setName('');
      setDescription('');
      setFile(null);
    } catch (error) {
      console.error('Error creating document:', error);
      setLoading(false);
    }

    // Reset form
    //setNewDocument({ name: '', description: '', file: null });
  };

  const headTableStyle = {
    color:"black",
    fontWeight: 'bold'
  }

  return (
   
    <Container component="main" maxWidth="md">


<Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"  
      sx={{ margin: "20px 0" }} // Optional styling for spacing
    >
       <Typography variant="h4" component="h1" gutterBottom>Welcome {customerName}</Typography>
      <Button variant="contained" color="primary"onClick={()=> handleLogout()}>
       Logout
      </Button>
    </Box>
      
      <Box component="form" onSubmit={handleUpload} sx={{ mb: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Document Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" component="label">
          Select File
          <input
            type="file"
            hidden
            accept=".jpg,.jpeg,.png,.pdf" 
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>
        {file && <span style={{ marginLeft: '1rem' }}>{file.name}</span>}
        <br></br>
        <p>*Only JPG and PNG Allowed</p>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit</Button>
      </Box>

    <h2>Uploaded Documents</h2>
    <TableContainer component={Paper}>
        <Table aria-label="documents table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc._id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.description}</TableCell>
                <TableCell>
                  {doc.file ? (
                    <a href={`http://localhost:3000/${doc.file}`} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : 'No File'}
                </TableCell>
                <TableCell>

                <Box
    sx={{
      display: 'inline-block',
      px: 2,
      py: 0.5,
      borderRadius: '8px',
      color: doc.status === 'Pending' ? 'black' : "white",
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 
        doc.status === 'Pending' ? 'yellow' : 
        doc.status === 'Rejected' ? 'red' : 
        'green',
    }}
  >
    {doc.status}
  </Box>

                </TableCell>
              
                <TableCell>
                 
                  <IconButton onClick={() => handleDelete(doc._id)} color="secondary">
                    <Delete />
                  </IconButton>
                  
                </TableCell>
              </TableRow>
            ))}
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
    </Container>
  );
}
