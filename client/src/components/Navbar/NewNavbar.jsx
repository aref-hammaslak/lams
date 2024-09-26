import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { Badge, Typography } from '@mui/material';
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
import useAuth from '../../hooks/useAuth';
import { LabAPI } from '../../apis/LabAPI';
import { LabIcon } from '../Home/LabIcon';
import { UserAPI } from '../../apis/UserAPI';
import { useGetUserRole } from '../../hooks/useGetUserRole';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useQuery } from '@tanstack/react-query';
import { MessageAPI } from '../../apis/MessageAPI';



const drawerWidth = 240;
const navItems = [['Home', '/log/logfilling'], ['Schedule', '/log/today']];

function NewNavbar(props) {
    const { window } = props;
    const [currentLab, setCurrentLab] = useState(null);
    const { auth } = useAuth();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const userRole = useGetUserRole();
    const navigate = useNavigate();
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    useEffect(() => {
        LabAPI.get(auth.lab_id).then(lab => setCurrentLab(lab));
    }, [auth.lab_id]);
    const handelLogout = async () => {
        try {
            await UserAPI.logout();
            navigate('/login', { replace: true })
        } catch (error) {
            console.log(error)
        }
    }

    const { data: unReadMessagesCount } = useQuery({
        queryKey: ['messagesUnreadCount'],
        queryFn: async () => await MessageAPI.getUnreadCount(),
        initialData : 0
    })

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
        <Box className={' fixed top-0 left-0 right-0 z-50'}>
            <AppBar className={'bg-blue-600 w-full '} component="nav">
                <Toolbar>
                    <IconButton onClick={handleDrawerToggle} edge='start' className={'sm:hidden'}>
                        <MenuIcon className='w-8 h-8 text-white' />
                    </IconButton>
                    <Logo />

                    {userRole === 'staff' ? (
                        <ul className={'hidden space-x-2  ml-8 sm:!flex'} >
                            <li className=' text-white transition  rounded hover:bg-white hover:text-primary' >
                                <Link to='/' className='flex items-center gap-1 p-2'>
                                    <HomeIcon className='w-5 h-5' />
                                    <span className='p-0 translate-y-[1px]'>
                                        Home
                                    </span>
                                </Link>
                            </li>
                            <li className=' text-white transition  rounded hover:bg-white hover:text-primary' >
                                <Link to='/log/status' className='flex items-center gap-1 p-2'>
                                    <ScheduleIcon className='w-5 h-5' />
                                    <span className='p-0 translate-y-[1px]'>
                                        Assignments
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    ) : (
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
                                <Menu >
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
                                            [['View Status', 'log/status'], ['Fill', 'log/fill'], ['Auto Fill', 'log/auto-fill'],
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

                            <li className='flex items-center  space-x-1 text-white transition-colors rounded hover:bg-white hover:text-primary' >
                                <Menu >
                                    <MenuHandler>
                                        <div className='flex items-center gap-1 cursor-pointer p-2'>
                                            <ScheduleIcon className='w-5 h-5' />
                                            <span className='p-0 translate-y-[1px]'>
                                                Schedule
                                            </span>
                                            <ArrowDropDownIcon className='pr-0' />
                                        </div>

                                    </MenuHandler>
                                    <MenuList >
                                        {
                                            [['Define', 'schedule/define'], ['Assign', 'schedule/assign'],
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

                            <li className='flex items-center  space-x-1 text-white transition-colors rounded hover:bg-white hover:text-primary' >
                                <Menu >
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
                                            [['Log Configs', 'setting/log-configs'], ['Departments', 'setting/departments'], ['Equipments', 'setting/equipments'],
                                            ['users', 'setting/users'], ['Surfaces', 'setting/surfaces'], ['Thermometers', 'setting/thermometers'],].map(([label, path], i) => (
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
                    )}

                    <Box sx={{ flexGrow: 1 }} />
                    <div className='flex items-center gap-1'>

                        <Typography className='bg-white pr-4 pl-2 py-1 rounded flex items-center'>
                            <LabIcon className=' !w-6 ' />
                            <span className='font-bold text-lg text-primary'>
                                {currentLab?.name}
                            </span>
                        </Typography>
                        <Link to={'/messages'}>
                            <IconButton
                                size="large"
                                color="inherit"
                            >
                                <Badge badgeContent={unReadMessagesCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Link>


                        <Menu animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                        }}>
                            <MenuHandler className={'w-8 h-8 cursor-pointer'}>
                                <AccountCircle />
                            </MenuHandler>
                            <MenuList >
                                <MenuItem className='py-0'>
                                    <Link className='inline-block py-2 w-full hover:text-primary' to='/profile'>
                                        <AccountBoxIcon /> Profile
                                    </Link>
                                </MenuItem>
                                {
                                    userRole === 'admin' && (
                                        <MenuItem className='py-0'>
                                            <Link className='inline-block py-2 w-full hover:text-primary' to='/laboratories'>
                                                <ListAltIcon /> Laboratories
                                            </Link>
                                        </MenuItem>
                                    )
                                }

                                <MenuItem onClick={handelLogout} className='py-0'>
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
