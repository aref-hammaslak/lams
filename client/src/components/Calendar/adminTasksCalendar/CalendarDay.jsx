import React, { useContext } from 'react'
import {
    Typography, Menu, MenuHandler, MenuList, MenuItem, Button,
} from '@material-tailwind/react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import dayjs from 'dayjs';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { logFillingContext } from '../../../contexts/LogFillingProvider';
import { useNavigate } from 'react-router-dom';

const CalendarDay = ({ content }) => {
    const taskCount = content.tasks?.length;
    const doneCount = content.tasks?.reduce((count, task) => {
        return task.done ? count + 1 : count;
    }, 0)
    const unDoneCount = taskCount - doneCount;
    const { setLogTempFilters, setNavigatedFromDashboard } = useContext(logFillingContext);
    const navigate = useNavigate();

    if (!content.tasks || content.tasks.length === 0) return (
        <div className='bg-white h-[100px] p-4 flex items-center text-center'>
            <Typography className='text-sm'>
                No scheduled task found
            </Typography>
        </div>
    )

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
    return (
        <div className={'bg-white  py-2 flex flex-col gap-1'}>

            <Menu>
                <MenuHandler>
                    {/* <Button>Menu</Button> */}
                    <p className='rounded bg-blue-50 text-[14px] text-gray-800  cursor-pointer relative'>
                        <AssignmentIcon className='text-primary ' />
                        Tasks: <span>{taskCount}</span>
                        <ArrowDropDownIcon className='  hover:!inline-block absolute right-0' />
                    </p>
                </MenuHandler>
                <MenuList className='w-[625px] '>
                    <div className='flex items-center py-1 text-gray-800 border-b outline-none font- hover:outline-none'>
                        <span className='w-[125px]'>Equipment</span>
                        <span className='w-[125px] '>Recurrence</span>
                        <span className='w-[125px]'>First Log Date</span>
                        <span className='w-[125px]'>User</span>
                        <span className='w-[60px] text-center text-primary font-semibold text-lg'>{content.date.format('dd D')}</span>
                    </div>
                    {
                        content.tasks.map((task, i) => (
                            <MenuItem className='px-2' key={i}>
                                <div className='flex items-center hover:outline-none'>
                                    <span className='w-[125px]'>{task.eq_details.name}</span>
                                    <span className='w-[125px]'>{task.eq_sch.recurrence}</span>
                                    <span className='w-[125px]'>{dayjs(task.eq_sch.initial_date).format('YY/MM/DD dd')}</span>
                                    <span className='w-[125px]'>{task.user.username}</span>
                                    <Button onClick={handleRenderLogFilling.bind(null, task)} size='sm' className='w-[80px] text-[10px]'> {task.done ? 'Edit' : 'Fill'} Log </Button>
                                </div>
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </Menu>

            <p className='rounded bg-green-50 text-[14px] text-gray-800 '>
                <CheckBoxIcon className='text-green-500' />
                Complete: <span>{doneCount}</span>
            </p>
            <p className='bg-red-50 text-[14px] text-gray-800 rounded'>
                <DisabledByDefaultIcon className='text-red-500 rounded ' />
                Incomplete: <span>{unDoneCount}</span>
            </p>
        </div>
    )
}

export default CalendarDay