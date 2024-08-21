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
import HomeIcon from '@mui/icons-material/Home';
import { Menu, MenuHandler, MenuList, MenuItem, Button, } from "@material-tailwind/react";
import SettingsIcon from '@mui/icons-material/Settings';
import Logo from './Logo';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';



const drawerWidth = 240;
const navItems = [['Home', '/log/logfilling'], ['Schedule', '/log/today']];

function NewNavbar(props) {
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
                    <li className=' uppercase border-b text-primaryDark hover:border-secondry' key={name}>
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
        <Box className={'relative'}>
            <AppBar position='fixed' className={'bg-blue-600 w-full'} component="nav">
                <Toolbar>
                    <IconButton onClick={handleDrawerToggle} edge='start' className={'sm:hidden'}>
                        <MenuIcon className='w-8 h-8 text-white' />
                    </IconButton>
                    <Logo />

                    <ul className={'hidden space-x-2  ml-8 sm:!flex'} >
                        <li className=' text-white transition transition-colors rounded hover:bg-white hover:text-primary' >
                            <Link to='/' className='flex items-center gap-1 p-2'>
                                <HomeIcon className='w-5 h-5' />
                                <span className='p-0 translate-y-[1px]'>
                                    Home
                                </span>
                            </Link>
                        </li>

                        <li className='flex items-center  space-x-1 text-white transition-colors rounded hover:bg-white hover:text-primary' >
                            <Menu animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                            }}>
                                <MenuHandler>
                                    <div className='flex items-center gap-1 cursor-pointer p-2'>
                                        <AssignmentIcon className='w-5 h-5' />
                                        <span className='p-0 translate-y-[1px]'>
                                            Log
                                        </span>
                                        <ArrowDropDownIcon className='pr-0' />
                                    </div>

                                </MenuHandler>
                                <MenuList >
                                    {
                                        [['status', 'log/status'], ['Fill', 'log/fill'], ['Auto Fill', 'log/auto-fill'],
                                        ].map(([label, path], i) => (
                                            <MenuItem key={i} className='hover:text-primary py-0' >
                                                <Link className='inline-block w-full hover:text-primary py-2' to={path}>
                                                    {label}
                                                </Link>
                                            </MenuItem>
                                        ))

                                    }

                                </MenuList>
                            </Menu>
                        </li>

                        <li className=' text-white transition transition-colors rounded hover:bg-white hover:text-primary' >
                            <Link to='/schedule' className='flex items-center gap-1 p-2'>
                                <ScheduleIcon className='w-5 h-5' />
                                <span className='p-0 translate-y-[1px]'>
                                    Schedule
                                </span>
                            </Link>
                        </li>
                        <li className='flex items-center  space-x-1 text-white transition-colors rounded hover:bg-white hover:text-primary' >
                            <Menu animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                            }}>
                                <MenuHandler>
                                    <div className='flex items-center gap-1 cursor-pointer p-2'>
                                        <SettingsIcon className='w-5 h-5' />
                                        <span className='p-0 translate-y-[1px]'>
                                            Setting
                                        </span>
                                        <ArrowDropDownIcon />
                                    </div>

                                </MenuHandler>
                                <MenuList>
                                    {
                                        [['Laboratory', 'setting/laboratory'], ['Department', 'setting/department'], ['Equipment', 'setting/equipment'],
                                        ['staff', 'setting/staff'], ['Surface', 'setting/surface'], ['Thermometer', 'setting/thermometer'],].map(([label, path], i) => (
                                            <MenuItem key={i} className='hover:text-primary py-0' >
                                                <Link className='inline-block w-full hover:text-primary py-2' to={path}>
                                                    {label}
                                                </Link>
                                            </MenuItem>
                                        ))

                                    }

                                </MenuList>
                            </Menu>
                        </li>
                        <li className=' text-white transition transition-colors rounded hover:bg-white hover:text-primary' >
                            <Link to='/' className='flex items-center gap-1 p-2'>
                                <BarChartIcon className='w-5 h-5' />
                                <span className='p-0 translate-y-[1px]'>
                                    Report
                                </span>
                            </Link>
                        </li>


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
                            <MenuHandler className={'w-8 h-8 '}>
                                <AccountCircle />
                            </MenuHandler>
                            <MenuList >
                                <MenuItem className='py-0'>
                                    <Link className='inline-block py-2 w-full hover:text-primary' to='/profile'>
                                        <AccountBoxIcon /> Profile
                                    </Link>
                                </MenuItem>

                                <MenuItem  className='py-0'>
                                    <a className=' py-2 hover:text-primary w-full inline-block space-x-1'><LogoutIcon /><span>Logout</span></a></MenuItem>
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

NewNavbar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default NewNavbar;
