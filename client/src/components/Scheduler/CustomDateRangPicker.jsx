import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { useReducer } from 'react';
import { NewspaperTwoTone } from '@mui/icons-material';
import { IconButton, List, ListItem } from '@material-tailwind/react';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';
import { Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { GridDeleteIcon } from '@mui/x-data-grid';

const pre_maidRanges = [
    { value: 'reset', label: 'Reset' },
    { value: 'current week', label: 'Current Week' },
    { value: 'next week', label: 'Next Week' },
    { value: 'current month', label: 'Currrent Month' },
    { value: 'next month', label: 'Next Month' },
    { value: 'current year', label: 'Current Year' },
    { value: 'next year', label: 'Next Year' },
    { value: 'reset start', label: 'Reset From' },
    { value: 'reset end', label: 'Reset To' },
    // {vaule : '', label: ''},
    // {vaule : '', label: ''},


]

function CalendarDay(props) {
    const { day, Dispatch, outsideCurrentMonth, dateRange, isSelected, dayItems, className, tabIndex, onDeleteItme, showItemRange, selectedItem, setSelectedItem, setShowItemRange, ...other } = props;



    const isInRange = day.isAfter(dateRange.start, 'day') && day.isBefore(dateRange.end, 'day');
    const isEndOfRang = day.isSame(dateRange.end, 'day');
    const isStartOfRang = day.isSame(dateRange.start, 'day');
    const dayItem = dayItems.get(day.toString());
    const isInItemRange = day.isAfter(selectedItem?.itemStartDate.subtract(1, 'day'), 'day') && day.isBefore(selectedItem?.itemEndDate, 'day');


    let selectedRangeStyles = '';
    if (dayItem && isInRange) {
        selectedRangeStyles = '!text-red-500 !font-semibold  !bg-blue-gray-50 ';
    } else if ((isEndOfRang || isStartOfRang) && dayItem) {
        selectedRangeStyles = '!bg-primary !text-red-500 ';
    }
    else if ((isEndOfRang || isStartOfRang)) {
        selectedRangeStyles = '!bg-primary text-white ';
    }
    else if (isInRange) {
        selectedRangeStyles = '!bg-blue-gray-50 !text-gray-800';
    }
    else if ((dayItem && (tabIndex === 0)) || dayItem) {
        selectedRangeStyles = '!text-red-500 !font-semibold !bg-white'
    } else if (tabIndex === 0) {
        selectedRangeStyles = '!bg-white !text-gray-800'
    }

    let selectedItemStyles;
    if (isInItemRange  ){
        selectedItemStyles = '!bg-red-50 !text-red-500';
    }
    else if (tabIndex === 0) {
        selectedItemStyles = '!bg-white !text-gray-800'
    }
    

    return (
        <div
            className={` ${!outsideCurrentMonth && 'shadow'} relative group  m-[4px] !rounded  border-gray-700 box-border`}
            key={props.day.toString()}

        >
            <PickersDay onClick={() => {
                if (showItemRange) return;
                Dispatch({ type: 'dayclicked', day })
            }} className={`
                ${showItemRange  ? selectedItemStyles : selectedRangeStyles}
           
                ${className}
                !rounded shadow text-[16px] 
                `} {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />

            <div

                className={` ${!outsideCurrentMonth && dayItem && 'group-hover:block'} z-10 top-1 right-1 cursor-pointer absolute hidden rounded-full`}>
                {showItemRange && isInItemRange && (
                    <GridDeleteIcon
                        onClick={() => {
                            onDeleteItme(dayItem.id)
                        setShowItemRange(false);
                        }}
                        className='w-5 h-5 -translate-x-[30px] text-red-800' />
                )}
                <MoreVertIcon
                    onClick={() => {
                        if (!showItemRange) {
                            setShowItemRange(true);
                            Dispatch({ type: 'reset' });
                            setSelectedItem(dayItem);
                            
                        } else {
                            setShowItemRange(false);
                            setSelectedItem(null);
                        }
                        
                    }}
                    className='w-5 h-5 -translate-y-[1px] ' />
                
            </div>
        </div>
    );
}
const dateRangeReducer = (state, action) => {
    switch (action.type) {
        case 'dayclicked': {
            const { day } = action;
            const newState = { ...state };
            if (day.isAfter(state.end) && day.isAfter(state.start)) {
                newState.end = day;
            }
            if (day.isAfter(state.start) && day.isBefore(state.end)) {
                newState.end = day;
            }
            if (day.isBefore(state.start) && day.isBefore(state.end)) {
                newState.start = day;
            }
            return newState;
        }
        case 'next week': {
            return {
                start: dayjs().add(1, 'week').startOf('week'),
                end: dayjs().add(1, 'week').endOf('week'),

            }
        }

        case 'current week': {
            return {
                start: dayjs().startOf('week'),
                end: dayjs().endOf('week')
            }
        }
        case 'current month': {
            return {
                start: dayjs().startOf('month'),
                end: dayjs().endOf('month')
            }
        }
        case 'next month': {
            return {
                start: dayjs().add(1, 'month').startOf('month'),
                end: dayjs().add(1, 'month').endOf('month')
            }
        }
        case 'current year': {
            return {
                start: dayjs().startOf('year'),
                end: dayjs().endOf('year')
            }
        }
        case 'next year': {
            return {
                start: dayjs().add(1, 'year').startOf('year'),
                end: dayjs().add(1, 'year').endOf('year')
            }
        }
        case 'reset': {
            return {
                start: dayjs(),
                end: dayjs(),
            }
        }
        case 'reset start': {
            return {
                ...state,
                start: state.end
            }
        }
        case 'reset end': {
            return {
                ...state,
                end: state.start
            }
        }
        default: {
            return {
                start: dayjs(),
                end: dayjs(),
            }
        }
    }
}

export function CustomDateRangPicker(props) {
    const { onRangeChange, dayItems, onDeleteItme, className } = props;
    const [showItemRange, setShowItemRange] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dateRange, Dispatch] = useReducer(dateRangeReducer,
        {
            start: dayjs(),
            end: dayjs(),
        });

    useEffect(() => {
        onRangeChange(dateRange.start, dateRange.end)
    }, [dateRange])

    useEffect(() => {
        const element = document.querySelector(
            '.css-1t0788u-MuiPickersSlideTransition-root-MuiDayCalendar-slideTransition'
        );
        // Now you can manipulate the element, e.g., change its background color
        element.style.height = '500px';

    })

    return (
        <div className={`${className}`}>
            <List className='flex flex-row max-w-[700px] gap-2 m-auto bg-primaryLight '>
                {
                    pre_maidRanges.map(({ value, label }, i) => {
                        return (
                            <>
                                {i !== 0 && <Divider className='!bg-white w-[1px] h-8 mt-2' />}
                                <ListItem key={i} className='p-0 hover:bg-primaryLight'>
                                    <Button className='p-2 text-center w-full   hover:text-primary text-[12px]' onClick={() => Dispatch({ type: value })}>
                                        {label}
                                    </Button>
                                </ListItem>
                            </>

                        )
                    })
                }
            </List>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    style={{
                        height: 800
                    }}
                    className='w-[700px]  max-h-[410px] !mt-0'
                    // value={dayjs(dateRange.start.format('YYYY-MM-DD'))}
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: CalendarDay,

                    }}
                    slotProps={{
                        day: {
                            Dispatch,
                            dateRange,
                            className: 'px-10 py-6  m-0 rounded-none !border-none',
                            dayItems,
                            onDeleteItme,
                            showItemRange,
                            setShowItemRange,
                            selectedItem,
                            setSelectedItem
                        },
                        calendarHeader: {
                            className: ' '
                        },
                    }}
                />
            </LocalizationProvider>
        </div>

    );
}