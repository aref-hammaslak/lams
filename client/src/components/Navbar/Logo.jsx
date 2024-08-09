import { Box } from '@mui/material'
import React from 'react';
import BiotechIcon from "@mui/icons-material/Biotech";
import Typography from "@mui/material/Typography";

const Logo = () => {
    return (
        <Box className={'flex items-center'}>
            <BiotechIcon
                fontSize="large"

            />
            <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                
            >
                LaMS
            </Typography>
        </Box>
    )
}

export default Logo