import React, { createContext, useState } from 'react'

export const LogsStatusFilterContext = createContext(null);

export const LogsStatusFilterProvider = ({ children }) => {
    const [filter, setFilter] = useState(null);


    return (
        <LogsStatusFilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </LogsStatusFilterContext.Provider>
    )
}
