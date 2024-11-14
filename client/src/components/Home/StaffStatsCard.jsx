import React, { useContext } from 'react'
import { Button, Tooltip, Typography } from '@material-tailwind/react'
import { PieChart } from '@mui/x-charts/PieChart';
import { Toolbar } from '@mui/material';
import { CustomPieChart } from './CustomPieChart';
import InfoIcon from '@mui/icons-material/Info';
import { LabIcon } from './LabIcon';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { LogsStatusFilterContext } from '../../contexts/LogsStatusFilterProvider';

export const StaffStatsCard = ({staffInfo}) => {
    const { _id, username,  stats } = staffInfo;
    const currYearStats = stats.logs.currentYear;
    const currMonthStats = stats.logs.currentMonth;
    const { setFilter , setActiveTab} = useContext(LogsStatusFilterContext);
    const navigate = useNavigate();
    
    const handelNavigateToLogsStatus = () => {
        setFilter({
            id: _id,
            type: 'staff'
        })
        setActiveTab('staff');
        navigate('/log/status');
    }

    return (
        <div className='min-w-[300px] shadow h-[190px] grid  grid-cols-2 gap-y-2 bg-primaryLight rounded p-4'>
            <Typography
                onClick={handelNavigateToLogsStatus}
                className='col-span-2   text-center font-bold text-lg bg-white border-primaryDark border-2  text-primaryDark py-2 rounded relative group flex justify-center items-center space-x-1 cursor-pointer'>
                <PersonIcon />
                <span>{username}</span>
            
            </Typography>

            <div className='  flex col-span-2 items-center justify-between px-2'>
                <Typography className='text-base font-normal flex-1 '>Current  month:</Typography>
                <Typography className='text-base font-normal flex-1'>Current  year:</Typography>

            </div>
            <div className=' -translate-x-5 -translate-y-10  flex col-span-2 items-center justify-between px-2'>
                <CustomPieChart stats={currMonthStats} />
                <CustomPieChart stats={currYearStats} />
            </div>
        </div>
    )
}
