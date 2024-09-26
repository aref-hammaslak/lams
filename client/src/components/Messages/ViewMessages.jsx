import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import { MessageAPI } from '../../apis/MessageAPI';
import useAuth from '../../hooks/useAuth';
import { Pagination } from '@mui/material';
import {Loading} from '../Global/Loading'
import { MessageItem } from './MessageItem';

export const ViewMessages = () => {
  const { auth: { id: userId } } = useAuth();
  const [messageType, setMessageType] = useState('received');// 'received' | 'sent'
  const [pageNum, setPageNum] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['messages', messageType, pageNum],
    queryFn: async () => {
      const queryParams = {
        page: pageNum,
        limit: 10,
        populate: messageType === 'sent' ? 'recipientId': 'senderId'
      };
      if (messageType === 'received') queryParams.recipientId = userId;
      else queryParams.senderId = userId;
      const messages = await  MessageAPI.getAll(queryParams);
      return messages;
    }
  })
  console.log('totalPage', data?.totalPage);
  return (
    <div className='w-full h-full relative flex flex-col'>
      <div className='w-full flex border-b border-primary'>
        <button onClick={() => setMessageType('received')} className={`flex-1 font-medium py-2 ${messageType === 'received' && 'bg-primary text-white'} rounded-t`}>Recieved</button>
        <button onClick={() => setMessageType('sent')} className={`flex-1 font-medium py-2 ${messageType === 'sent' && 'bg-primary text-white'} rounded-t`}>Sent</button>
      </div>
      <div className='flex-1 relative overflow-y-auto scrollbar-thin space-y-1  py-2 mb-4'>
        {isLoading && <Loading />}
        {data?.messages.map((message, i) => (
          <MessageItem key={i} messageItem={message} type={messageType} />
        ))}
      </div>
      <Pagination page={pageNum} color='primary' onChange={(_,page)=> setPageNum(page)} count={data?.totalPage}  variant="outlined" shape="rounded" />
    </div>
  )
}
