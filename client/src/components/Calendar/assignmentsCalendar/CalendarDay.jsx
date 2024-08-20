import React, { useContext } from 'react'
import {
    Typography, Menu, MenuHandler, MenuList, MenuItem, Button, Badge
} from '@material-tailwind/react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import dayjs from 'dayjs';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { logFillingContext } from '../../../contexts/LogFillingProvider';
import { useNavigate } from 'react-router-dom';
import { useGetUserRole } from '../../../hooks/useGetUserRole';
import { Tooltip } from '@mui/material';


const CalendarDay = ({ content }) => {

    const { setLogTempFilters, setNavigatedFromDashboard } = useContext(logFillingContext);
    const navigate = useNavigate();
    const role = useGetUserRole();
    console.log('role :', role);
    // const role = 'staff';

    const taskCount = content.tasks?.length;
    const doneCount = content.tasks?.reduce((count, task) => {
        return task.done ? count + 1 : count;
    }, 0)
    const unDoneCount = taskCount - doneCount;

    function handleRenderLogFilling(task) {
        const { eq_details, eq_sch, log_temp } = task;
        const filters = {
            equipment: eq_details.name,
            eq_id: eq_details._id,
            startDate: content.date.toDate(),
            endDate: content.date.add(1, 'day').toDate(),
            logTemp: {
                ...log_temp,
                eq_details,
                schedule: eq_sch
            }
        }
        setLogTempFilters(filters);
        setNavigatedFromDashboard(true);
        navigate('/log/logfilling');

    }

    if (!content.tasks || content.tasks.length === 0) return (
        <div className='flex items-center justify-center h pt-4 text-gray-700 '>
        <Typography>
            No Assignment
        </Typography>
 
        </div>
   );


    return (
        <div className={'bg-white  pb-2 pt-4 flex flex-col gap-1 hover:outline hover:outline-secondry hover:outline-2 hover:-outline-offset-2 z-10 '}>

            <Menu>
                <MenuHandler>
                    <div className='flex flex-wrap justify-center gap-3 cursor-pointer '>
                        <Tooltip title='Tasks Count'>
                            <Badge  className='w-4 h-4 bg-blue-300' content={taskCount} >
                                <AssignmentIcon className='w-7 h-7 text-primary' />
                            </Badge>
                        </Tooltip>
                        <Tooltip title='Done Count'>
                            <Badge className='bg-green-300' content={taskCount} >
                                <CheckBoxIcon className='text-green-500 w-7 h-7' />
                            </Badge>
                        </Tooltip>
                        <Tooltip title='Undone Count'>
                            <Badge className='bg-red-300' content={taskCount} >
                                <DisabledByDefaultIcon className='!overflow-hidden text-red-500 !rounded-lg w-7 h-7' />
                            </Badge>
                        </Tooltip>
                    </div>
                </MenuHandler>
                <MenuList className={`w-[${role === 'admin' || role === 'supervisor' ? 625 : 500}px] `}>
                    <div className='flex items-center py-1 text-gray-800 border-b outline-none font- hover:outline-none'>
                        <span className='w-[125px]'>Equipment</span>
                        <span className='w-[125px] '>Recurrence</span>
                        <span className='w-[125px]'>First Log Date</span>
                        {
                            (role === 'admin' || role === 'supervisor') &&
                            <span className='w-[125px]'>User</span>
                        }
                        <span className='w-[60px] text-center text-primary font-semibold text-lg'>{content.date.format('dd D')}</span>
                    </div>
                    {
                        content.tasks.map((task, i) => (
                            <MenuItem className='px-2' key={i}>
                                <div className='flex items-center hover:outline-none'>
                                    <span className='w-[125px]'>{task.eq_details.name}</span>
                                    <span className='w-[125px]'>{task.eq_sch.recurrence}</span>
                                    <span className='w-[125px]'>{dayjs(task.eq_sch.initial_date).format('YY/MM/DD dd')}</span>
                                    {
                                        (role === 'admin' || role === 'supervisor') &&
                                        <span className='w-[125px]'>{task.user.username}</span>
                                    }
                                    <Button onClick={handleRenderLogFilling.bind(null, task)} size='sm' className='w-[80px] text-[10px]'> {task.done ? 'Edit' : 'Fill'}</Button>
                                </div>
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </Menu>


        </div>
    )
}

export default CalendarDay