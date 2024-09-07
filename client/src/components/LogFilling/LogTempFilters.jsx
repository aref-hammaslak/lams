/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { Box } from '@mui/material'
import LogTemplateSelection from './LogTemplateSelection'
import SDEDForm from './SDEDForm'
import { logFillingContext } from '../../contexts/LogFillingProvider'
import { Button } from '@material-tailwind/react'

const LogTempFilters = () => {
    const { logTempFilters, setLogTempFilters, setDisplayLogs } = useContext(logFillingContext);

    const handelMonthChange = (type) => {
        const { startDate, endDate } = logTempFilters;
        switch (type) {
            case 'next':
                setLogTempFilters(state => {
                    return {
                        ...state,
                        startDate: startDate.add(1, 'month').startOf('month'),
                        endDate: endDate.add(1, 'month').endOf('month'),
                    }
                })
                break;
            case 'prev':
                setLogTempFilters(state => {
                    return {
                        ...state,
                        startDate: startDate.subtract(1, 'month').startOf('month'),
                        endDate: endDate.subtract(1, 'month').endOf('month'),
                    }
                })
                break;

            default:
                break;
        }
    }

    return (
        <Box className={"w-full flex   justify-center flex-col "}>
            <Box >
                <LogTemplateSelection

                />
            </Box>
            <Box>
                <SDEDForm
                />
            </Box>
            <div className='mt-4 space-y-4'>
                <Button onClick={() => handelMonthChange('prev')} className='w-full bg-primaryDark tracking-widest'>prev month</Button>
                <Button onClick={() => handelMonthChange('next')} className='w-full bg-primaryDark tracking-widest'>next month</Button>
            </div>

        </Box>
    )
}

export { LogTempFilters }