import React, { useContext } from 'react'
import {
    Menu, MenuHandler, MenuList, MenuItem, Button, Badge, Spinner
} from '@material-tailwind/react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Tooltip, } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { api } from '../../../apis/configs/axiosConfig';
import dayjs from 'dayjs';
import { RefreshContext } from '../../../contexts/RefreshProvider';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { func } from 'prop-types';
import EquLogAPI from '../../../apis/EquLogAPI';


export const NotAssignedSchedulesMenu = (props) => {
    const { notAssignedSchcdulesStatus, date } = props;
    const { total, done, items } = notAssignedSchcdulesStatus ?? {};
    const { enqueueSnackbar } = useSnackbar();
    const { handelRefresh } = useContext(RefreshContext)

    const autoFillLogTempSch = async (logTempId, schId) => {
        try {
            const response = await api.request({
                url: `/log/equipment/auto-fill/${logTempId}/${schId}`,
                method: 'GET',
                params: {
                    date: dayjs(date).format('YYYY-MM-DD'),
                }
            })
            const { payload: log, success } = response.data;
            return log;
        }

        catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            throw new Error(error);
        }
    }

    const autoFillMutation = useMutation({
        mutationKey: ['autoFillLogTempSch'],
        mutationFn: async ({ logTempId, schId }) => {
            return await autoFillLogTempSch(logTempId, schId);
        },
        onSuccess: () => {
            enqueueSnackbar("The log filled automaticlly!", { variant: "success" });
            handelRefresh();
        }
    })

    const deleteLogMutation = useMutation({
        mutationKey: ['deleteAutoFilledLog'],
        mutationFn: async (logId) => {
            return await EquLogAPI.delete(logId);
        },
        onSuccess: () => {
            enqueueSnackbar("The log deleted successfully!", { variant: "success" });
            handelRefresh();
        },
        onError: () => {
            enqueueSnackbar("Something went wrong!", {variant:"error"})
        }
    })


    function handleAutoFilll(logTempId, schId) {
        autoFillMutation.mutate({ logTempId, schId });
    }

    function handleDelete(logId) {
        console.log("🚀 ~ handleDelete ~ logId:", logId)
        deleteLogMutation.mutate(logId);
    }

    return (
        <>
            {
                !notAssignedSchcdulesStatus ? (
                    <p className='text-sm font-normal '>
                        No Item
                    </p>
                ) : (
                    <Menu>
                        <MenuHandler>
                            <div className='flex flex-wrap justify-center gap-3 cursor-pointer '>
                                <Tooltip title='Not Assigned Schedules'>
                                    <Badge className='w-4 h-4 bg-blue-300' content={total + ''} >
                                        <AssignmentLateIcon className='w-7 h-7 text-primary' />
                                    </Badge>
                                </Tooltip>
                                <Tooltip title='Done'>
                                    <Badge className='bg-green-300 w-4 h-4' content={done + ''} >
                                        <CheckBoxIcon className='text-green-500 w-7 h-7' />
                                    </Badge>
                                </Tooltip>
                                <Tooltip title='Not Done'>
                                    <Badge className='bg-red-300 w-4 h-4' content={(total - done) + ''} >
                                        <DisabledByDefaultIcon className='!overflow-hidden text-red-500 !rounded-lg w-7 h-7' />
                                    </Badge>
                                </Tooltip>
                            </div>
                        </MenuHandler>
                        <MenuList className={`w-[375px] `}>
                            <div className='flex items-center py-1 text-gray-800 border-b outline-none font- hover:outline-none'>
                                <span className='w-[125px]'>Equipment</span>
                                <span className='w-[125px] '>Recurrence</span>
                                <span className='w-[60px] text-center text-primary font-semibold text-lg'>{date.format('dd D')}</span>
                            </div>
                            {
                                items.map((item, i, items) => (
                                    <MenuItem className='px-2' key={i}>
                                        <div className='flex items-center hover:outline-none'>
                                            <span className='w-[125px]'>{item.id.eq_id.name}</span>
                                            <span className='w-[125px]'>{item.recurrence}</span>
                                            {
                                                item.done ? (
                                                    <Button onClick={() => { handleDelete(item.log_id) }} size='sm' className='bg-primaryDark w-[80px] text-[10px]'>Delete</Button>
                                                ) : (
                                                    <Button onClick={() => { handleAutoFilll(item.id._id, item._id) }} size='sm' className='bg-primaryDark w-[80px] text-[10px]'> AutoFill</Button>
                                                )
                                            }

                                        </div>
                                    </MenuItem>
                                ))
                            }
                        </MenuList>
                    </Menu >
                )
            }
        </>
    )
}
