import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, CircularProgress,Select,MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditDocument = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const fetchDocument = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/documents/${id}`);
      setName(res.data.name);
      setDescription(res.data.description);
      setSelectedOption(res.data.status);
      setExistingFile(res.data.file);
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  useEffect(() => {
    fetchDocument();
    // eslint-disable-next-line
  }, []);

  const handleChange = (event) =>  {
    setSelectedOption(event.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('Name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('status', selectedOption);
    if (file) formData.append('file', file);

    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/api/documents/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      navigate('/documents');
    } catch (error) {
      console.error('Error updating document:', error);
      setLoading(false);
    }
  };

  const options = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Approved', label: 'Approved' }
  ]

  return (
    <Paper style={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Edit Document
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
         <Typography variant="h6" gutterBottom>
        Document Status
      </Typography>
         <div style={{ marginBottom: '1rem', width: '200px' }}>
         {/* <Select value={selectedOption} onChange={handleChange} variant="contained" options={options} /> */}
         <Select
            fullWidth
            value={selectedOption}
            onChange={handleChange}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.label}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
         </div>

        <div style={{ marginBottom: '1rem' }}>
          <Button variant="contained" component="label">
            Upload New File
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          {file ? (
            <span style={{ marginLeft: '1rem' }}>{file.name}</span>
          ) : existingFile ? (
            <span style={{ marginLeft: '1rem' }}>
              Existing File: <a href={`http://localhost:3000/${existingFile}`} target="_blank" rel="noopener noreferrer">View</a>
            </span>
          ) : (
            <span style={{ marginLeft: '1rem' }}>No File</span>
          )}
        </div>
        <div>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default EditDocument;
