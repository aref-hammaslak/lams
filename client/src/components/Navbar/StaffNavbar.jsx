import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { Badge } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";

import Logo from './Logo';

import { useNavigate, useLocation, Link } from 'react-router-dom';


const drawerWidth = 240;
const navItems = [['Log Record', '/log/logfilling'], ['Today Logs', '/log/today']];

function StaffNavbar(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} className='w-[240px]'>
            <Box className='flex items-center justify-center py-4 text-blue-950'>
                <Logo />
            </Box>
            <Divider />
            <ul className='px-8 py-4 space-y-2 text-center '>
                {navItems.map(([name, path]) => (
                    <li className='p-2 uppercase border-b text-primaryDark hover:border-secondry' key={name}>
                        <Link to={path} className=''>
                            {name}
                        </Link>
                    </li>


                ))}
            </ul>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box className={''}>
            <AppBar position='static' className={'bg-blue-600'} component="nav">
                <Toolbar>
                    <IconButton onClick={handleDrawerToggle} edge='start' className={'sm:hidden'}>
                        <MenuIcon className='w-8 h-8 text-white' />
                    </IconButton>
                    <Logo />

                    <ul className={'hidden space-x-2  ml-8 sm:!flex'} >
                        {navItems.map(([name, path]) => (
                            <li className='p-2 text-sm font-semibold text-white uppercase rounded hover:bg-white hover:text-primary' key={name}>
                                <Link to={path} className=''>
                                    {name}
                                </Link>
                            </li>


                        ))}

                    </ul>
                    <Box sx={{ flexGrow: 1 }} />
                    <div className='flex items-center gap-1'>
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <Menu animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                        }}>
                            <MenuHandler className={'w-6 h-6 '}>
                                <AccountCircle />
                            </MenuHandler>
                            <MenuList >
                                <MenuItem><AccountBoxIcon/> Profile</MenuItem>
                                <MenuItem><LogoutIcon/>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}></Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    className={` !w-[240px] overflow-hidden`}

                >
                    {drawer}
                </Drawer>
            </nav>

        </Box>
    );
}

StaffNavbar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default StaffNavbar;
