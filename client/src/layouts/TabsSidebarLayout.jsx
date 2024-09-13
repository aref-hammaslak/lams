import React from 'react'
import { Tabs, TabsHeader, Tab, IconButton } from '@material-tailwind/react'
import { GridCloseIcon, GridFilterListIcon } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

export const TabsSidebarLayout = (props) => {
    const { tabs, activeTab, onTabChange, isSidebarOpen, toggleSidebar, sidebarElement, children } = props;
    return (
        <div>
            {/* Nav tabs */}
            <Tabs value={activeTab} className='w-full border-b fixed z-20 bg-white'>
                <IconButton onClick={toggleSidebar} className='!absolute left-2 top-2 z-20  bg-primaryDark' >
                    {
                        isSidebarOpen ?
                            <GridCloseIcon /> :
                            <GridFilterListIcon />
                    }
                </IconButton>
                <TabsHeader
                    className=" w-[600px] m-auto rounded-none  border-blue-gray-50 bg-transparent p-0"
                    indicatorProps={{
                        className:
                            " border-b-2  border-primary shadow-none rounded-none",
                    }}
                >

                    {tabs.map(({ label, value }) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => onTabChange(value)}
                            className={`${activeTab === value ? "text-primary" : ""} py-4`}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
            </Tabs>
            <div className="flex  ">
                {/* Sidebar */}
                <div
                    className={`fixed top-[122px] shadow bottom-0 left-0 w-64 text-black transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
                        } transition-transform duration-300 ease-in-out bg-white `}
                >

                    <div className="p-4 -ml-2 ">
                        {sidebarElement}
                    </div>
                </div>

                {/* Main Content */}
                <div className={`${isSidebarOpen ? 'w-[calc(100vw-256px)] ml-64' : 'w-full'} mt-[58px] min-h-screen flex flex-col bg-gray-50 duration-300 ease-in-out transition-all`}>
                    {
                        children
                    }
                </div>
            </div>
        </div>
    )
}


TabsSidebarLayout.PropTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
        label: PropTypes.string
    })),
    activeTab: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    onTabChange: PropTypes.func,
    isSidebarOpen: PropTypes.bool,
    toggleSidebar: PropTypes.func,
    sidebarComponent: PropTypes.element,
}