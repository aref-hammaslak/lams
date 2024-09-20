/* eslint-disable react/prop-types */
import React, { useReducer } from 'react'
import { useState, createContext, useEffect } from 'react';
import useEquLog from '../hooks/useEquLog';


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
  const equLog = useEquLog(logTempFilters);
  const [stepperState, stepperDispatch] = useReducer(stepperReducer,  stepperInitialState );
  

  return (
    <logFillingContext.Provider value={{
      logTempFilters, setLogTempFilters,
       equLog
      , stepperState, stepperDispatch
    }} >
      {children}
    </logFillingContext.Provider>
  )
}

export { LogFillingProvider }