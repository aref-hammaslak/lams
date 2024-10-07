import React, { useContext } from 'react'
import {
    Typography, Menu, MenuHandler, MenuList, MenuItem, Button, Badge, Spinner
} from '@material-tailwind/react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import dayjs from 'dayjs';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { logFillingContext } from '../../../contexts/LogFillingProvider';
import { useNavigate } from 'react-router-dom';
import { useGetUserRole } from '../../../hooks/useGetUserRole';
import { Tooltip, } from '@mui/material';


const CalendarDay = (props) => {
    const { content, onClickAssignment: handleClickAssignment } = props;
    const {  stepperDispatch } = useContext(logFillingContext);
    const navigate = useNavigate();
    const role = useGetUserRole();
    // const role = 'staff';
    console.log(content);

    const taskCount = content.tasks?.reduce((count, task) => {

        if (task?.sch?.type !== 'equipment') return count;
        return count + 1;
    }, 0)
    // const taskCount = content.tasks?.length;

    const doneCount = content.tasks?.reduce((count, task) => {
        if (task.sch.type !== 'equipment') return count;
        return task.done ? count + 1 : count;
    }, 0)
    const unDoneCount = taskCount - doneCount;

    function handleRenderLogFilling(tasks, logTempId) {
        tasks = tasks.filter(task => task.sch.type === 'equipment');
        
        const filters = tasks.map((task, i) => {
            const { sch, logTemplate } = task;
            const filter = {
                equipment: logTemplate.equipment.name,
                eq_id: logTemplate.equipment._id,
                startDate: content.date.toDate(),
                endDate: content.date.toDate(),
                logTemp: {
                    ...logTemplate,
                    eq_details: logTemplate.equipment,
                    schedule: sch
                }
            }
            return filter;
        })

        const selectedIndex = filters.findIndex(({ logTemp }) => logTemp._id === logTempId);
        stepperDispatch({
            type: 'setFilters',
            filters: filters,
            activeStep: selectedIndex,
            date: content.date,
        })

        // navigate('/log/fill', { preventScrollReset: false });
        handleClickAssignment();
    }

    if (!content.tasks || taskCount === 0) return (
        <div className='text-center w-full flex-1  justify-center flex items-center text-gray-700 '>
            <Typography>
                No Log Found
            </Typography>

        </div>
    );


    return (
        <div className={'bg-white  pb-2 pt-4 flex-1 items-center flex flex-col gap-1 transition-colors    hover:bg-primaryLight h-auto'}>
            <Menu>
                <MenuHandler>
                    <div className='flex flex-wrap justify-center gap-3 cursor-pointer '>
                        <Tooltip title='Logs Count'>
                            <Badge className='w-4 h-4 bg-blue-300' content={taskCount + ''} >
                                <AssignmentIcon className='w-7 h-7 text-primary' />
                            </Badge>
                        </Tooltip>
                        <Tooltip title='Done Count'>
                            <Badge className='bg-green-300 w-4 h-4' content={doneCount + ''} >
                                <CheckBoxIcon className='text-green-500 w-7 h-7' />
                            </Badge>
                        </Tooltip>
                        <Tooltip title='Undone Count'>
                            <Badge className='bg-red-300 w-4 h-4' content={unDoneCount + ''} >
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
                        content.tasks.map((task, i, tasks) => (


                            task.sch.type === 'equipment' ? (
                                <MenuItem className='px-2' key={i}>
                                    <div className='flex items-center hover:outline-none'>
                                        <span className='w-[125px]'>{task.logTemplate.equipment.name}</span>
                                        <span className='w-[125px]'>{task.sch.recurrence}</span>

                                        <span className='w-[125px]'>{dayjs(task.sch.initial_date).format('YY/MM/DD dd')}</span>
                                        {
                                            (role === 'admin' || role === 'supervisor') &&
                                            <span className='w-[125px]'>{task.user.username}</span>
                                        }
                                        <Button onClick={handleRenderLogFilling.bind(null, tasks, task.logTemplate._id)} size='sm' className='bg-primaryDark w-[80px] text-[10px]'> {task.done ? 'Edit' : 'Fill'}</Button>
                                    </div>
                                </MenuItem>
                            ) :
                                    // task.sch.type
                                       
                                null


                        ))
                    }
                </MenuList>
            </Menu>
        </div>
    )
}

export default CalendarDay