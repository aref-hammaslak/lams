import React, { createContext, useState } from 'react'

export const LogsStatusFilterContext = createContext(null);

export const LogsStatusFilterProvider = ({ children }) => {
    const [filter, setFilter] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // all | staff | equip

    return (
        <LogsStatusFilterContext.Provider value={{ filter, setFilter, activeTab, setActiveTab }}>
            {children}
        </LogsStatusFilterContext.Provider>
    )
}
