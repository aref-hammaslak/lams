import React from 'react'
import { Spinner } from '@material-tailwind/react'

export const Loading = ({className}) => {
  return (
      <div className={`${className} absolute h-full  w-full top-0 right-0 bg-gray-50  flex items-center justify-center  bg-opacity-40 z-50`} >
          <Spinner />
      </div>
  )     
}
