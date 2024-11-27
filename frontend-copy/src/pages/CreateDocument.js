import React, { useState } from 'react';
import {
  TextField, Button, Paper, Typography, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CreateDocument = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  console.log("Token " + token)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [fileHash, setFileHash] = useState(null);

  const generateHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer); // Generate SHA-256 hash
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert hash buffer to byte array
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
};

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    formData.append('type', 'admin');
    formData.append('ownerId', token);
    if (file) formData.append('file', file);

    try {
      setLoading(true);

       // Function to generate SHA-256 hash of the file
       try {
        const hash = await generateHash(file);
        setFileHash(hash);

        setTimeout(async () => {
        formData.append('hashkey', hash); // Include the hash
        console.log(formData);
        await axios.post('http://localhost:3000/api/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

      // Step 2: Upload the hash to the blockchain
       const blockchainData = {
        functionName: 'CreateAsset',
        args: [hash, name, '1', description, '1'], // Adjust args to include relevant metadata
        };

      await axios.post('http://54.145.145.237:3000/invoke', blockchainData, {
        headers: {
            'Content-Type': 'application/json',
        },
      });


      }, 0); // Delay ensures state has updated

    } catch (error) {
         console.error('Error generating file hash:', error);
        alert('Failed to generate hash. Please try again.');
    }
    setLoading(false);
    navigate('/documents');
    // };

    // reader.onerror = () => {
    //   alert('Error reading file');
    //   setLoading(false);
    // };

    } catch (error) {
      console.error('Error creating document:', error);
      setLoading(false);
    }
  };

  return (
    <Paper style={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Create New Document
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>
        {file && <span style={{ marginLeft: '1rem' }}>{file.name}</span>}
        <div style={{ marginTop: '1rem' }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default CreateDocument;
