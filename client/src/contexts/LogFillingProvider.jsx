/* eslint-disable react/prop-types */
import React from 'react'
import { useState , createContext} from 'react';
import useLogTemp from '../hooks/useLogTemp';
import useEquLog from '../hooks/useEquLog';



// eslint-disable-next-line react-refresh/only-export-components
export const logFillingContext = createContext({});

const LogFillingProvider = ({children}) => {
    const [logTempFilters, setLogTempFilters] = useState({});
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [displayLogs, setDisplayLogs] = useState(false);
  const  [navigatedFromDashboard, setNavigatedFromDashboard] = useState(false); 
	const { equipments, logSchedules, recurrenceTypeCodes, updateSetDefaults, loading, } = useLogTemp(logTempFilters, setLogTempFilters);
  const equLog = useEquLog(logTempFilters);



  return (
    <logFillingContext.Provider value={{ logTempFilters, setLogTempFilters, equipments, logSchedules, recurrenceTypeCodes, updateSetDefaults, loading,
        isDrawerOpen, setIsDrawerOpen,displayLogs, setDisplayLogs, equLog
        , navigatedFromDashboard, setNavigatedFromDashboard
     }} >
    {children}
    </logFillingContext.Provider>
  )
}

export default LogFillingProvider