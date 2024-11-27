// src/components/AlertBox.js
import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function AlertBox({ severity, title, message, onClose }) {
    if (!message) return null; // Do not render anything if no message

    return (
        <Alert
            severity={severity} // Types: success, error, warning, info
            onClose={onClose} // Close button functionality
            style={{ marginBottom: '1rem' }}
        >
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
        </Alert>
    );
}

export default AlertBox;
