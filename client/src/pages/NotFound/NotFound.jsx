import React from 'react'
import InfoIcon from '@mui/icons-material/Info';

export const NotFound = () => {
  return (
      <div className='flex items-center justify-center w-full h-svh'>
          <div className='space-y-2 bg-gray-50 p-20 rounded-lg'>
              <h1 className='space-x-1 text-center text-2xl font-bold'>
                  <InfoIcon className="text-red-500 " />
                  <span>
                      Not Found
                  </span>
              </h1>
              <p className=" text-gray-700 text-center ">
                  We can not find that page. 
              </p>

          </div>
      </div>
  )
}
