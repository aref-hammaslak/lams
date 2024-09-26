import React, { useEffect, useRef, useState } from 'react'
import { Recipients } from './Recipients';
import { Icon, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useMutation , useQueryClient} from '@tanstack/react-query';
import { MessageAPI } from "../../apis/MessageAPI";
import useAuth from "../../hooks/useAuth";
import EmojiPicker from 'emoji-picker-react';
import { useSnackbar } from "notistack";
const CustomEmogiPicker = (props) => {
  const { isEmogiPickerOpen, setIsEmogiPickerOpen, onEmojiClick } = props;

  const handelClose = () => setIsEmogiPickerOpen(false);
  return (
    <div className='fixed inset-0  backdrop-blur-[1px]  bg-transparent cursor-pointer' onClick={handelClose}>
      <div onClick={e => e.stopPropagation()} className='!absolute z-50 right-[50vw] top-1/2  -translate-y-1/2'>
      <EmojiPicker  allowExpandReactions={false} className='z-50' onEmojiClick={onEmojiClick}/>
        
      </div>
    </div>

  )
}

export const SendMessage = () => {
  const [recipents, setRecipients] = useState([]);
  const [message, setMessage] = useState('');
  const [isEmogiPickerOpen, setIsEmogiPickerOpen] = useState(false);
  const { auth: { id: userId } } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const textareaRef = useRef(null);
  
  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: () => {
      MessageAPI.createMessage({
        senderId: userId,
        recipients: recipents,
        message: message.trim(),
      })
    },
    onSuccess: () => {
      setRecipients([]);
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['message']});
      queryClient.refetchQueries({queryKey:['messages']})
      enqueueSnackbar('Message sent successfully!',{variant:'success'})
    }
  })

  useEffect(() => {
    const messageBox = textareaRef?.current;
    if (!messageBox) return;

    const handelKekDown = function (event) {
      console.log("🚀 ~ handelKekDown ~ event:", event)
      if (event.key === "Enter") {
        // If Shift + Enter is pressed, insert a newline
        if (event.shiftKey) {
          // Allow default behavior (newline insertion)
          return;
        } else {
          // Prevent default Enter key behavior (form submission)
          event.preventDefault();
          // Call the submit function to submit the message
          if (message.length !== 0 && recipents.length !== 0)
            mutation.mutate()
        }
      }
    }

    messageBox.addEventListener("keydown",handelKekDown);
    return () => {
      messageBox.removeEventListener('keydown', handelKekDown)
    }
  })

  const handelAddRecipients = (newRecepients) => {
    setRecipients(Array.from(new Set([...recipents, ...newRecepients])))
  }

  const hndelDeleteRecipient = (recipient) => {
    setRecipients(recipents.filter(rec => rec !== recipient));
  }

  const handelSend = () => {
    mutation.mutate()
  }
  const hnadelAddEmmoji = (emoji) => {
    setMessage(message + emoji.emoji);
  }

  return (
    <div className='relative h-full flex flex-col'>

      <Recipients recipents={recipents} onDeleteRecipient={hndelDeleteRecipient} onAddRecipient={handelAddRecipients} />

      <textarea value={message} ref={textareaRef} onChange={(e) => setMessage(e.target.value)} className='bg-primaryLight peer  focus:outline-none pb-20 pt-4 h-[200px]  flex-1 resize-none w-full mt-4 px-4 rounded-lg font-medium   text-gray-800' placeholder='Type Message...' />

      
      <div className='w-full bg-primaryLight rounded-b-lg peer-focus:border-primary  px-4 py-2 border-t border-primaryDark  absolute bottom-0'>
        <div>
          <IconButton>

            <AttachFileIcon />
          </IconButton>
          <IconButton onClick={() => setIsEmogiPickerOpen(true)}>
            <InsertEmoticonIcon />
          </IconButton>
        </div>
        <IconButton disabled={message.length === 0 || recipents.length === 0 } onClick={handelSend} className='p-2 text-primary -rotate-12 text-base absolute  top-2 right-4'>
          <SendIcon  className='' />
        </IconButton>
        {/* <input type='file' className=' ' /> */}
      </div>

      {isEmogiPickerOpen &&
        <CustomEmogiPicker onEmojiClick={hnadelAddEmmoji} isEmogiPickerOpen={isEmogiPickerOpen} setIsEmogiPickerOpen={setIsEmogiPickerOpen} />}
    </div>
  )
}


