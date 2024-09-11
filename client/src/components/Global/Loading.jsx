import React from 'react'
import { Spinner } from '@material-tailwind/react'

export const Loading = ({className}) => {
  return (
      <div className={`${className} fixed h-full w-full inset-0 flex items-center bg-transparent justify-center bg-gray-50 bg-opacity-70 z-50`} >
          <Spinner />
      </div>
  )
}
