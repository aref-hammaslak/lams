/* eslint-disable react/prop-types */
import React, { useReducer } from 'react'
import { useState, createContext, useEffect } from 'react';
import useLogTemp from '../hooks/useLogTemp';
import useEquLog from '../hooks/useEquLog';
import { useLocation } from 'react-router-dom';


const stepperInitialState = {
  activeStep: 0,
  isLastStep: false,
  isFirstStep: true,
  filters: [],
  date: null
}
function stepperReducer(state, action) {
  switch (action.type) {
    case 'setFilters':
      return {
        ...state,
        activeStep: action.activeStep,
        filters: action.filters,
        isFirstStep: action.activeStep === 0 ? true : false,
        isLastStep: action.activeStep === action.filters.length - 1 ? true : false,
        date: action.date,
      }
    case 'setActiveStep': return {
      ...state,
      activeStep: action.value,
      isFirstStep: action.value === 0 ? true : false,
      isLastStep: state.filters.length === action.value + 1 ? true : false,
    }
    case 'prev': {
      return {
        ...state,
        activeStep: state.activeStep > 0 ? state.activeStep - 1 : state.activeStep,
        isFirstStep: state.activeStep === 1 ? true : false,
        isLastStep: false,
        
      }
    }
    case 'next': {
      return {
        ...state,
        activeStep: state.activeStep < state.filters.length - 1 ? state.activeStep + 1 : state.activeStep, 
        isLastStep: state.filters.length  === state.activeStep +2 ? true : false,
        isFirstStep: false
      }
    }
    case 'setIsLastStep': return {
      ...state,
      isLastStep: action.value,
    }
   case 'setIsFirstStep': return {
      ...state,
      isFirstStep: action.value,
    }
  
    default:
      break;
  }

  
}

// eslint-disable-next-line react-refresh/only-export-components
export const logFillingContext = createContext({});

const LogFillingProvider = ({ children }) => {
  const [logTempFilters, setLogTempFilters] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [displayLogs, setDisplayLogs] = useState(false);
  const [navigatedFromLogsStatus, setNavigatedFromLogsStatus] = useState(false);
  const { equipments, logSchedules, recurrenceTypeCodes, updateSetDefaults, loading, } = useLogTemp(logTempFilters, setLogTempFilters, navigatedFromLogsStatus);
  const equLog = useEquLog(logTempFilters);
  const location = useLocation();
  const [stepperState, stepperDispatch] = useReducer(stepperReducer,  stepperInitialState );
  

  useEffect(() => {
    function handleHashChange() {
      if (navigatedFromLogsStatus && location.pathname !== '/log/fill') setNavigatedFromLogsStatus(false);
    }
    handleHashChange();
  }, [location]);





  return (
    <logFillingContext.Provider value={{
      logTempFilters, setLogTempFilters, equipments, logSchedules, recurrenceTypeCodes, updateSetDefaults, loading,
      isDrawerOpen, setIsDrawerOpen, displayLogs, setDisplayLogs, equLog
      , navigatedFromLogsStatus, setNavigatedFromLogsStatus, stepperState, stepperDispatch
    }} >
      {children}
    </logFillingContext.Provider>
  )
}

export { LogFillingProvider }