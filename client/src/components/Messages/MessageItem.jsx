import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Person, ArrowDropDown, ResetTvRounded } from "@mui/icons-material";
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageAPI } from '../../apis/MessageAPI';

const getDate = (date) => {
    const today = dayjs();
    const yserterday = today.subtract(1, 'day');
    const twoDaysAgo = today.subtract(2, 'day');
    if (date.isSame(today, 'day')) return 'Today';
    if (date.isSame(yserterday, 'day')) return 'Yesterday';
    if (date.isSame(twoDaysAgo, 'day')) return 'Two Days Ago';
    return date.format('YYYY/MM/DD');
}

export const MessageItem = (props) => {
    const { messageItem: { _id: messageId, createdAt, recipientId, senderId, message, senderType, isRead }, type } = props;
    const date = getDate(dayjs(createdAt))
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['messageMarkAsRead'],
        mutationFn: async () => {
            return await MessageAPI.MarkMessageAsRead(messageId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', type] });
            queryClient.invalidateQueries({ queryKey: ['messagesUnreadCount'] })
        }
    })
    
    const handelClick = () => {
        setOpen(!open);
        if (!isRead && type === 'received') mutation.mutate();
    }

    const label = () => {
        switch (type) {
            case 'sent': {
                if (!recipientId.username) return <span className='text-[15px] font-medium'>Deleted user</span>
                return <><span className='text-[15px] font-medium'>{recipientId.username}</span>
                    <span className='text-sm text-gray-700'>{recipientId.name}</span></>
            }
            case 'received': {
                if (!senderId.username) return <span className='text-[15px] font-medium'>Deleted user</span>
                if (senderType === 'admin') return <span className='text-sm font-medium'>Supervisor</span>
                else if (senderType === 'system') return <span>System</span>
                return <><span className='text-[15px] font-medium'>{senderId.username}</span>
                    <span className='text-sm text-gray-700'>{senderId.name}</span></>
            }
        }
    }

    const getMessageStatus = () => {
        if (isRead)
            return <MarkChatReadIcon className='text-lg text-green-600' />
        else
            return <MarkChatUnreadIcon className='text-lg text-red-600' />
    }

    return (
        <div className='w-full p-2 bg-primaryLight rounded-md'>
            <div onClick={handelClick} className='w-full flex justify-between cursor-pointer'>
                <div className='flex items-center gap-2 flex-1 cursor-pointer'>
                    <Person className='text-primaryDark' />
                    <div className='flex flex-col'>
                        {label()}
                    </div>


                </div>
                <div className='space-x-2 flex items-center'>
                    <div className='flex flex-col items-end gap-1'>
                        <span className='text-sm text-gray-700 font-medium'>
                            {date}
                        </span>
                        {getMessageStatus()}
                    </div>
                    <ArrowDropDown className='text-primaryDark' />
                </div>

            </div>
            {
                open && (<p className='bg-white p-4 rounded-md text-sm text-gray-900'>{
                    message
                }</p>)
            }
        </div>
    )
}
