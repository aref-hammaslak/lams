import React, { useContext } from 'react'
import {
    Menu, MenuHandler, MenuList, MenuItem, Button, Badge, Spinner
} from '@material-tailwind/react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Tooltip, } from '@mui/material';
import { useGetUserRole } from '../../../hooks/useGetUserRole';
import { LogsStatusFilterContext } from '../../../contexts/LogsStatusFilterProvider';
import { AssignedSchedulesMenu } from './AssignedSchedulesMenu';
import { NotAssignedSchedulesMenu } from './NotAssignedSchedulesMenu';


const CalendarDay = (props) => {
    const { content, onClickAssignment } = props;
    const { notAssignedSchcdulesStatus, date, tasks } = content;
    const { activeTab } = useContext(LogsStatusFilterContext);

    const role = useGetUserRole();



    return (
        <div className={'bg-white px-4 flex-1 flex flex-col py-2 gap-2  relative '}>

            <div className=' h-[60px] py-3 flex gap-1 justify-center  transition-colors flex-1 items-center hover:bg-primaryLight'>
                <AssignedSchedulesMenu tasks={tasks} role={role} date={date} onClickAssignment={onClickAssignment} />
            </div>

            {
                (role !== 'staff' && activeTab === 'all') &&  (
                    <div className='border-t py-3 h-[60px] flex gap-1 justify-center transition-colors  items-center hover:bg-primaryLight'>
                        <NotAssignedSchedulesMenu notAssignedSchcdulesStatus={notAssignedSchcdulesStatus} date={date} />
                    </div>
                )
            }


        </div>
    )
}


// {
//     activeTab === 'all' && notAssignedSchcdulesStatus && (
//         <div className='absolute bottom-full mb-2 left-4  bg-gray-800 flex justify-center align-baseline  w-5 h-5 rounded-full text-white cursor-pointer'>
//             <Tooltip
//                 placement='top'
//                 arrow
//                 slotProps={{
//                     popper: {
//                         modifiers: [
//                             {
//                                 name: 'offset',
//                                 options: {
//                                     offset: [0, -5],
//                                 },
//                             },
//                         ],
//                     },
//                 }}
//                 title={
//                     <>
//                         <h5>Not Assigned Schedules</h5>
//                         <span>Loged by admin: {notAssignedSchcdulesStatus.done}/{notAssignedSchcdulesStatus.total}</span>
//                     </>
//                 } className=''>
//                 <span className='text-sm'>
//                     {notAssignedSchcdulesStatus.total}
//                 </span>
//             </Tooltip>
//         </div>)
// }

export default CalendarDay