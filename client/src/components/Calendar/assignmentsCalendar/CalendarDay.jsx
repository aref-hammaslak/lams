import React, { useContext } from 'react'
import {
   Menu, MenuHandler, MenuList, MenuItem, Button, Badge, Spinner
} from '@material-tailwind/react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import dayjs from 'dayjs';
import { logFillingContext } from '../../../contexts/LogFillingProvider';
import { Tooltip, } from '@mui/material';
import { useGetUserRole } from '../../../hooks/useGetUserRole';


const CalendarDay = (props) => {
    const { content, onClickAssignment: handleClickAssignment } = props;
    const { stepperDispatch } = useContext(logFillingContext);
    const { notAssignedSchcdulesStatus } = content

    const role = useGetUserRole();

    const taskCount = content.tasks?.reduce((count, task) => {

        if (task?.sch?.type !== 'equipment') return count;
        return count + 1;
    }, 0)

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

        handleClickAssignment();
    }

    return (
        <div className={'bg-white  py-4  flex-1 items-center flex flex-col gap-1 transition-colors    hover:bg-primaryLight relative '}>
            {
                notAssignedSchcdulesStatus && (
                    <div className='absolute bottom-full mb-2 left-4  bg-gray-800 flex justify-center align-baseline  w-5 h-5 rounded-full text-white cursor-pointer'>
                        <Tooltip
                            placement='top'
                            arrow
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -5],
                                            },
                                        },
                                    ],
                                },
                            }}
                            title={
                            <>
                                    <h5>Not Assigned Schedules</h5>
                                    <span>Loged by admin: {notAssignedSchcdulesStatus.done}/{notAssignedSchcdulesStatus.total}</span>
                            </>
                        }  className=''>
                            <span className='text-sm'>
                                {notAssignedSchcdulesStatus.total}
                            </span>
                        </Tooltip>
                    </div>)
            }

            {
                !content.tasks || taskCount === 0 ? (
                    <p className='text-sm font-normal '>
                        No Assignment
                    </p>
                ) : (
                    <Menu>
                        <MenuHandler>
                            <div className='flex flex-wrap justify-center gap-3 cursor-pointer '>
                                <Tooltip title='Total Assignmets'>
                                    <Badge className='w-4 h-4 bg-blue-300' content={taskCount + ''} >
                                        <AssignmentIcon className='w-7 h-7 text-primary' />
                                    </Badge>
                                </Tooltip>
                                <Tooltip title='Done'>
                                    <Badge className='bg-green-300 w-4 h-4' content={doneCount + ''} >
                                        <CheckBoxIcon className='text-green-500 w-7 h-7' />
                                    </Badge>
                                </Tooltip>
                                <Tooltip title='Not Done'>
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
                )
            }

        </div>
    )
}

export default CalendarDay