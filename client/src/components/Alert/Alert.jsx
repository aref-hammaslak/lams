/* eslint-disable react/prop-types */
import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import MUIAlert from '@mui/material/Alert';

const Alert = ({ isOpen, setIsOpen, message,alertSeverity, props }) => {
    return (

        <Snackbar open={isOpen} onClose={() => setIsOpen(false)}>
            <MUIAlert
                onClose={() => setIsOpen(false)}
                severity={alertSeverity}
                variant="standard"
                sx={{ width: '100%' }}
            >
                
                {message}
            </MUIAlert>

        </Snackbar>


    )
}

export default Alert