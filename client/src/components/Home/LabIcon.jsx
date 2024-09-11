import React from 'react'
import labIcon from '../../assets/lab_icon.svg'

export const LabIcon = ({ className }) => {
  return (
    <>
      <img className={`${className} w-6 inline-block h-6 -translate-y-[1px]`} src={labIcon} />
    </>
  )
}
