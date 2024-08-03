import React, { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom';
export const AlertContext = createContext({});
// eslint-disable-next-line react/prop-types
const AlertProvider = ({children}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
  return (
    <AlertContext.Provider value={{isOpen, setIsOpen, message, setMessage, alertSeverity, setAlertSeverity}}>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertProvider