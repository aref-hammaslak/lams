import React from 'react'
import { Button, Tooltip, Typography } from '@material-tailwind/react'
import { PieChart } from '@mui/x-charts/PieChart';
import { Toolbar } from '@mui/material';
import { CustomPieChart } from './CustomPieChart';
import InfoIcon from '@mui/icons-material/Info';
import { LabIcon } from './LabIcon';

export const LabStatsCard = ({ labInfo, onSelect }) => {
    const { name, email, phone, category, stats } = labInfo
    const currYearStats = stats.logs.currentYear;
    const currMonthStats = stats.logs.currentMonth;
    return (
        <div className='min-w-[300px] shadow h-[250px] grid  grid-cols-2 gap-y-2 bg-primaryLight rounded p-4'>
            <Typography onClick={onSelect}   className='col-span-2 hover:opacity-90 cursor-pointer  text-center font-bold text-md bg-primaryDark text-white py-2 rounded relative group flex justify-center items-center '>
                <LabIcon/>
                <span>{name}</span>
                <Tooltip content='click to set lab as your workspace' className='bg-gray-800'>
                    <InfoIcon fontSize='small' className='absolute hidden group-hover:inline-block right-4 top-1/2 -translate-y-1/2'/>
                </Tooltip>
            </Typography>
            <p className='px-2'>
                <span className='text-base font-normal'>Phone:</span>
                <span className='font-semibold block text-gray-800'>
                    {phone ?? 'Not definde'}
                </span>
            </p>
            <p className='pr-2'>
                <span className='text-base font-normal'>Email:</span>
                <Tooltip className='bg-gray-800' hidden={email.length < 20} content={email} title={email}>
                    <span className='font-semibold block text-blue-gray-800 overflow-hidden'>
                        {email}
                    </span>
                </Tooltip>

            </p>


            <div className='  flex col-span-2 items-center justify-between px-2'>
                <Typography className='text-base font-normal flex-1 '>Current  month:</Typography>
                <Typography className='text-base font-normal flex-1'>Current  year:</Typography>
                
            </div>
            <div className=' -translate-x-5 -translate-y-9  flex col-span-2 items-center justify-between px-2'>
                <CustomPieChart stats={currMonthStats} />
                <CustomPieChart stats={currYearStats} />
            </div>
        </div>
    )
}
