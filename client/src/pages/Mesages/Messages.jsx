import React from 'react';
import { ViewMessages } from "../../components/Messages/ViewMessages";
import { SendMessage } from "../../components/Messages/SendMessage";

export const Messages = () => {
  return (
    <div className='flex py-8 mx-auto gap-8 w-full h-[calc(100vh-65px)] container '>
      <div className='bg-white flex-1 rounded-lg p-8'>
        <ViewMessages />
      </div>
      <div className='bg-white flex-1 rounded-lg p-8'>
        <SendMessage />
      </div>
    </div>
  )
}
