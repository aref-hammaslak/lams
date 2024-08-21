import { Box } from '@mui/material'
import React from 'react';
import BiotechIcon from "@mui/icons-material/Biotech";
import Typography from "@mui/material/Typography";
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Box className={'flex items-center'}>
            <Link to='/'>
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
            </Link>
        </Box>
    )
}

export default Logo