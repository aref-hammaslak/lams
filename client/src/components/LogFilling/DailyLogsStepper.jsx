import React, { useContext, useEffect } from 'react'
import { Stepper, Step, Button } from "@material-tailwind/react";
import { logFillingContext } from '../../contexts/LogFillingProvider';

export const DailyLogsStepper = () => {
  const { stepperState, stepperDispatch, setLogTempFilters} = useContext(logFillingContext);
  const { activeStep, isLastStep, isFirstStep, filters,  } = stepperState;

  const handleNext = () => !isLastStep && stepperDispatch({type: 'next'});
  const handlePrev = () => !isFirstStep && stepperDispatch({type: 'prev'});

  useEffect(() => {
    setLogTempFilters(filters[activeStep]);
  }, [stepperState]);

  return (
    <div className="w-full py-4 px-8">
      <Stepper
        
        activeLineClassName='bg-secondry'
        activeStep={activeStep}
        isLastStep={(value) => stepperDispatch({type: 'setIsLastStep', value})}
        isFirstStep={(value) => stepperDispatch({type: 'setIsFirstStep', value})}
      >
        {
          filters.map((filter , index) => (
            <Step completedClassName='bg-primaryDark' activeClassName='bg-primaryDark' className='cursor-pointer  text-white' key={index} onClick={() => stepperDispatch({type:'setActiveStep' , value: index})}>{index + 1}</Step>
          ))
        }
      </Stepper>
      <div className="mt-8 flex justify-between">
        <Button className='bg-primaryDark' onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button className='bg-primaryDark' onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div>
    </div>
  );
}
