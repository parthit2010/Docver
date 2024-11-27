import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, CircularProgress,
  AppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import CustomerDashboard from './CustomerDashboard';
import { useNavigate } from "react-router-dom";


const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Customer");
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null); // State to track which document is loading
  const navigate = useNavigate();

  const [isCustomer, setIsCustomer] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchDocuments = async (type) => {
    try {
      const res = await axios.get('http://localhost:3000/api/documents');
      const filteredDocuments = res.data.filter(doc => doc.type === type);
      // Fetch customer details for each document
    const documentsWithCustomerNames = await Promise.all(
      filteredDocuments.map(async (doc) => {
        try {
          const customerRes = await axios.get(`http://localhost:3000/api/customers/${doc.ownerId}`);
          return { ...doc, customerName: customerRes.data.username }; // Assuming customer API returns a `name` field
        } catch (error) {
          console.error(`Error fetching customer for ownerId ${doc.ownerId}:`, error);
          return { ...doc, customerName: "Unknown" }; // Handle missing customer gracefully
        }
      })
    );

    setDocuments(documentsWithCustomerNames);
  //    setDocuments(filteredDocuments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments("customer");
  }, []);

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

  const verifyDoc = async(id)=> {
    //alert("Verify doc " + id);
    setLoadingId(id); // Set the loading state for the current document

    try {
      const res = await axios.get(`http://localhost:3000/api/documents/${id}`);
      console.log(res.data.name);
      console.log(res.data.description);
      console.log(res.data.status);
      console.log(res.data.type);
      console.log(res.data.hashkey);



      // Step 2: Upload the hash to the blockchain
      const blockchainData = {
        functionName: 'AssetExists',
        args: [res.data.hashkey],
        };

      const blockResponse = await axios.post('http://54.145.145.237:3000/invoke', blockchainData, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      console.log(blockResponse.data);
      console.log(blockResponse.data.result);
      var status = "";
      if(blockResponse.data.result == 'true'){
        status = "Approved";
        console.log("Status1 = " + status);
      }else{
        status = "Rejected";
        console.log("Status2 = " + status);
      }

      const formData = new FormData();
      formData.append('status', status);

      setLoading(true);
      await axios.put(`http://localhost:3000/api/documents/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);

       // Update the local state to reflect the status change
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc._id === id ? { ...doc, status } : doc
      )
    );

     // fetchDocuments("Customer"); // Refresh the document list

    } catch (error) {
      console.error('Error fetching document:', error);
    }finally{
      setLoadingId(null); // Reset loading state after verification
    }


  }

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    fetchDocuments(tab === "Customer" ? "customer" : "admin");
  };


  if (loading) return <CircularProgress />;

  return (
    <div>
      {/* <Login/> */}
      {/* <Register/> */}
      {/* <CustomerDashboard/> */}

      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Document Verification System</Typography>
        </Toolbar>
      </AppBar> */}


<Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"  
      sx={{ margin: "20px 0" }} // Optional styling for spacing
    >
      <Button
        variant="contained"
        color="success"
        component={Link}
        to="/documents/create"
        style={{ margin: '1rem' }}
      >
        Create Document
      </Button>
      <Button variant="contained" color="primary"onClick={()=> handleLogout()}>
       Logout
      </Button>
    </Box>
    


      <Button
        variant={selectedTab == "Customer" ? "contained" : "outlined"}
        color= {selectedTab == "Customer" ? "primary" : "primary"}
        //component={Link}
        //to="/documents/create"
        onClick={() => handleTabChange("Customer")}
        style={{ margin: '1rem' }}>
        Customer Documents
      </Button>


      <Button
        variant={selectedTab == "Admin" ? "contained" : "outlined"}
        color= {selectedTab == "Admin" ? "primary" : "primary"}
        //component={Link}
        //to="/documents/create"
        onClick={() => handleTabChange("Admin")}
        style={{ margin: '1rem' }}
      >
        Admin Documents
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="documents table">
          <TableHead>
            <TableRow>
            {selectedTab == "Customer" ?    <TableCell>Customer ID</TableCell> : null}
              <TableCell>Doc Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>File</TableCell>
              {selectedTab == "Customer" ? <TableCell>Status</TableCell> : null}
              {selectedTab == "Customer" ? <TableCell>Blockchain Verification</TableCell> : null}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc._id}>
               {selectedTab == "Customer" ?    <TableCell>{doc.customerName}</TableCell>: null}
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.description}</TableCell>
                <TableCell>
                  {doc.file ? (
                    <a href={`http://localhost:3000/${doc.file}`} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : 'No File'}
                </TableCell>
                {selectedTab == "Customer" ?
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

                </TableCell>: null}
                {selectedTab == "Customer" ?  <TableCell> 
                  <Button onClick={() => verifyDoc(doc._id)} 
                  disabled={loadingId === doc._id}
                  variant="contained" color="primary" >{loadingId === doc._id ? 'Verifying...' : 'Verify'}</Button>  
                  </TableCell>: null}
                <TableCell>
                  <IconButton component={Link} to={`/documents/edit/${doc._id}`} color="primary">
                    <Edit />
                  </IconButton>
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

    </div>
  );
};

export default Documents;
