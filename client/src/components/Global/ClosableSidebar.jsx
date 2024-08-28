import React ,{useState} from 'react'
import { GridCloseIcon, GridFilterListIcon } from "@mui/x-data-grid";

export const ClosableSidebar = ({ children , isOpen , toggleIsOpen, className}) => {
   
    return (
        <div
            className={` ${isOpen ? 'w-[250px] h-full  px-4 top-0 left-0 pt-4' : 'w-10 top-4 left-4 rounded-md '} mt-[64px] z-10 bg-white  fixed  flex flex-col items-end  border-r-2 shadow-md ${className}`}
            open={isOpen}
        >
            <div onClick={() => toggleIsOpen()} className='cursor-pointer' >
                {
                    isOpen ? <GridCloseIcon className="w-10 inline-block h-10 " /> :
                        <GridFilterListIcon className="w-10 inline-block h-10 " />
                }
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} overflow-y-auto py-4`}>
                {children}
            </div>
        </div>
    )
}
