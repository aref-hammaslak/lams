import React, { createContext, useContext, useState } from 'react'

export const RefreshContext = createContext({});

export const RefreshProvider = ({ children }) => {
    const [needToRefresh, setNeedToRefresh] = useState(false);
    const handelRefresh = () => {
        setNeedToRefresh(n => !n);
    }
  return (
      <RefreshContext.Provider value={{needToRefresh, handelRefresh}}>
          {children}
    </RefreshContext.Provider>
  )
}


