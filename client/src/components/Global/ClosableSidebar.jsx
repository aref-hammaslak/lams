import React, { useState } from 'react'
import { GridCloseIcon, GridFilterListIcon } from "@mui/x-data-grid";
import { IconButton } from '@material-tailwind/react'

export const ClosableSidebar = ({ children, isOpen, toggleIsOpen, className }) => {

    return (
        <div
            className={` ${isOpen ? 'w-[250px] h-full  px-4 top-0 left-0 pt-4' : 'w-8 top-4 left-4 rounded-md '} mt-[64px] z-10 bg-white  fixed  flex flex-col items-end  border-r-2 shadow-md  ${className}`}
            open={isOpen}
        >
            <div onClick={() => toggleIsOpen()} className='cursor-pointer' >
                <IconButton className='bg-primaryDark w-8 h-8'>
                    {
                        isOpen ? <GridCloseIcon   /> :
                            <GridFilterListIcon  />
                    }

                </IconButton>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} h-[calc(100vh-120px)] scrollbar-none overflow-y-auto pt-2 my-2 pb-4`}>
                {children}
            </div>
        </div>
    )
}
