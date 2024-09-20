import React, { useContext, useEffect } from 'react'
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { logFillingContext } from '../../contexts/LogFillingProvider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import dayjs from 'dayjs';
import DayContext from '../../contexts/DayProvider';

export const DailyLogsStepper = () => {
  const { stepperState, stepperDispatch, setLogTempFilters } = useContext(logFillingContext);
  
  const { activeStep, isLastStep, isFirstStep, filters, date } = stepperState;
  const { filteredDays } = useContext(DayContext);

  const handleNext = () => !isLastStep && stepperDispatch({ type: 'next' });
  const handlePrev = () => !isFirstStep && stepperDispatch({ type: 'prev' });

  useEffect(() => {
    setLogTempFilters(filters[activeStep ]);
  }, [stepperState.activeStep, stepperState.filters]);


  function handleNextDay() {
    let nextDay = date.add(1, 'day');
    let tasks = filteredDays.get(nextDay).tasks;
    tasks = tasks.filter(task => task.sch.type === 'equipment');
    while (!(tasks.length > 0) && !nextDay.isSame(date.endOf('month'), 'day')) {
      nextDay = nextDay.add(1, 'day');
      tasks = filteredDays.get(nextDay)?.tasks;
      tasks = tasks.filter(task => task.sch.type === 'equipment');
    }

   
    if (tasks.length === 0) return;

    const filters = tasks.map((task, i) => {
      const { sch, logTemplate } = task;
      const filter = {
        equipment: logTemplate.equipment.name,
        eq_id: logTemplate.equipment._id,
        startDate: nextDay.toDate(),
        endDate: nextDay.toDate(),
        logTemp: {
          ...logTemplate,
          eq_details: logTemplate.equipment,
          schedule: sch
        }
      }
      return filter;
    })

    stepperDispatch({
      type: 'setFilters',
      filters,
      activeStep: 0,
      date: nextDay,
    })
  }
  function handlePrevDay() {

    let prevDay = date.subtract(1, 'day');
    let tasks = filteredDays.get(prevDay).tasks;
    tasks = tasks.filter(task => task.sch.type === 'equipment');
    while (!(tasks.length > 0) && !prevDay.isSame(date.startOf('month'), 'day')) {
      prevDay = prevDay.subtract(1, 'day');
      tasks = filteredDays.get(prevDay).tasks;
      tasks = tasks.filter(task => task.sch.type === 'equipment');
    }

    
    if (tasks.length === 0) return;

    const filters = tasks.map((task, i) => {
      const { sch, logTemplate } = task;
      const filter = {
        equipment: logTemplate.equipment.name,
        eq_id: logTemplate.equipment._id,
        startDate: prevDay.toDate(),
        endDate: prevDay.toDate(),
        logTemp: {
          ...logTemplate,
          eq_details: logTemplate.equipment,
          schedule: sch
        }
      }
      return filter;
    })

    stepperDispatch({
      type: 'setFilters',
      filters,
      activeStep: 0,
      date: prevDay,
    })

  }

  return (
    <div className="w-full relative pt-10">
      <div className='absolute bg-white -top-10 left-1/2 -translate-x-1/2 px-4 flex items-center '>
        <button onClick={handlePrevDay} disabled={dayjs().startOf('month').isSame(date, 'day')} className='cursor-pointer disabled:invisible hover:text-primaryDark text-blue-gray-600'>
          <ChevronLeftIcon className='w-10 h-10  ' />
        </button>
        <span className='font-bold text-2xl text-primary border rounded p-2 shadow'>
          {date.format('D , dddd')}
        </span>
        <button onClick={handleNextDay} disabled={dayjs().endOf('month').isSame(date, 'day')} className='cursor-pointer disabled:invisible hover:text-primaryDark text-blue-gray-600'>
          <ChevronRightIcon className='w-10 h-10  ' />
        </button>
      </div>

      <Stepper
        className=' mx-auto'
        completedLineClassName='bg-primaryDark'
        activeLineClassName='bg-secondry'
        activeStep={activeStep}
      >
        {
          filters.map((filter, index) => (
            <Step completedClassName='bg-primaryDark' activeClassName='bg-secondry text-primaryDark' className='cursor-pointer  text-white' key={index} onClick={() => stepperDispatch({ type: 'setActiveStep', value: index })}>
              <span>
                {index + 1}
              </span>
              <div className='absolute top-10 '>
                <Typography className='text-blue-gray-700 font-medium flex flex-col justify-center gap-1'>
                  <span className='text-center'>{filter.equipment}</span>
                  <span className='text-center'>{filter.logTemp.schedule.recurrence}</span >
                </Typography>
                <span>

                </span>
              </div>
            </Step>
          ))
        }
      </Stepper>

      <div className="mt-16 flex justify-end gap-4">
        <Button className='bg-primaryDark' onClick={handlePrev} disabled={isFirstStep}>
          Prev log
        </Button>
        <Button className='bg-primaryDark' onClick={handleNext} disabled={isLastStep}>
          Next log
        </Button>
      </div>
    </div>
  );
}
