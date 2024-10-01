import { Button } from '@material-tailwind/react';
import React from 'react'

export const CustomDialog = (props) => {
    const { onClose, onConfirm, onCancel, title, subTitle , confirmText , confirmColor } = props;
  return (
      <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]  bg-transparent cursor-pointer' onClick={(e) => {
          onClose();
      }}>
          <div onClick={e => e.stopPropagation()} className='px-8 py-4 rounded-lg max-w-[380px] min-w-[250px]  bg-white border'>
              <div className='border-b pb-2 space-y-2'>
                  <h1 className="text-2xl font-bold text-black col-span-2">
                      {
                        title
                      }
                  </h1>

                  <p className="text-gray-700 text-sm col-span-12">
                      {
                          subTitle
                      }
                  </p>
              </div>
              <div className='flex justify-end mt-2'>
                  <Button onClick={onCancel} className=' px-3 tracking-wider py-2 text-orange-600 ' variant='text'>
                      cnacel
                  </Button>
                  <Button onClick={() => {onConfirm()}} className={` px-3 tracking-wider py-2 text-green-800  ${confirmColor}`} variant='text'>
                      {confirmText}
                  </Button>
                  
              </div>
          </div>
      </div>
  )
}
