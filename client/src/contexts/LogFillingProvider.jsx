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
  dailyLogFilters: []
}
function stepperReducer(state, action) {
  switch (action.type) {
    case 'setFilters':
      return {
        ...state,
        activeStep: action.selectedIndex,
        filters: action.filters,
        isFirstStep: action.index === 0 ? true : false,
        isLastStep: action.index === action.filters.length -1 ?  true : false,
      }
    case 'setActiveStep': return {
      ...state,
      activeStep : action.value,
    }
    case 'prev': {
      return {
        ...state,
        activeStep: state.activeStep > 0 ? state.activeStep - 1 : state.activeStep,
       
      }
    }
    case 'next': {
      return {
        ...state,
        activeStep: state.activeStep < state.filters.length -1 ? state.activeStep +1 : state.activeStep, 
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
  const [navigatedFromDashboard, setNavigatedFromDashboard] = useState(false);
  const { equipments, logSchedules, recurrenceTypeCodes, updateSetDefaults, loading, } = useLogTemp(logTempFilters, setLogTempFilters);
  const equLog = useEquLog(logTempFilters);
  const location = useLocation();
  const [stepperState, stepperDispatch] = useReducer(stepperReducer,  stepperInitialState );
  

  useEffect(() => {
    function handleHashChange() {
      if (navigatedFromDashboard && location.pathname !== '/log/fill') setNavigatedFromDashboard(false);
    }
    handleHashChange();
  }, [location]);





  return (
    <logFillingContext.Provider value={{
      logTempFilters, setLogTempFilters, equipments, logSchedules, recurrenceTypeCodes, updateSetDefaults, loading,
      isDrawerOpen, setIsDrawerOpen, displayLogs, setDisplayLogs, equLog
      , navigatedFromDashboard, setNavigatedFromDashboard, stepperState, stepperDispatch
    }} >
      {children}
    </logFillingContext.Provider>
  )
}

export { LogFillingProvider }