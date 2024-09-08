import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { useReducer } from 'react';
import { NewspaperTwoTone } from '@mui/icons-material';
import { IconButton, List, ListItem, Typography } from '@material-tailwind/react';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';
import { Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { ScheduleAPI } from '../../apis/ScheduleAPI';

const pre_maidRanges = [
    { value: 'reset', label: 'Reset' },
    { value: 'current week', label: 'Current Week' },
    { value: 'next week', label: 'Next Week' },
    { value: 'current month', label: 'Currrent Month' },
    { value: 'next month', label: 'Next Month' },
    { value: 'current year', label: 'Current Year' },
    { value: 'next year', label: 'Next Year' },
    { value: 'reset start', label: 'Reset Start' },
    { value: 'reset end', label: 'Reset End' },
    // {vaule : '', label: ''},
    // {vaule : '', label: ''},


]

function CalendarDay(props) {
    const { day, Dispatch, outsideCurrentMonth, dateRange, isSelected, dayItems, className, tabIndex, onDeleteItme, showItemRange, selectedItem, setSelectedItem, setShowItemRange, selectedItemSch, setSelectedItemSch, ...other } = props;



    const isInRange = day.isAfter(dateRange.start, 'day') && day.isBefore(dateRange.end, 'day');
    const isEndOfRang = day.isSame(dateRange.end, 'day');
    const isStartOfRang = day.isSame(dateRange.start, 'day');
    const dayItem = dayItems.get(day.format('YYYY-MM-DD'));
    
    const itemStartDate = selectedItem?.itemStartDate || selectedItemSch?.itemStartDate;
    const itemEndDate = selectedItem?.itemEndDate || selectedItemSch?.itemEndDate;

    const isInItemRange = day.isAfter(itemStartDate?.subtract(1, 'day'), 'day') && day.isBefore(itemEndDate, 'day');

    const circle = "after:content-[''] after:absolute   after:w-5 after:h-5 after:bg-primary after:z-10 after:rounded-full after:top-2 after:left-2";

    let selectedRangeStyles = '';
    if (dayItem && isInRange) {
        selectedRangeStyles = `!bg-green-600   !bg-blue-gray-50 `;
    } else if ((isEndOfRang || isStartOfRang) && dayItem) {
        selectedRangeStyles = ` !bg-green-600 !text-gray-800 ${circle} `;
    }
    else if ((isEndOfRang || isStartOfRang) ) {
        selectedRangeStyles = `!bg-white !text-gray-800 ${circle} `;
    }
    else if (isInRange) {
        selectedRangeStyles = '!bg-blue-gray-50 !text-gray-800';
    }
    else if ((dayItem && (tabIndex === 0)) || dayItem) {
        selectedRangeStyles = `!bg-green-600  !text-black `
    }
    else if (tabIndex === 0) {
        selectedRangeStyles = '!bg-white !text-gray-800'
    }

    let selectedItemStyles;
    if ((isInItemRange && (tabIndex === 0)) || isInItemRange) {
        selectedItemStyles = '!bg-orange-200 !text-black !font-semibold';
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

                className={` ${(!outsideCurrentMonth && dayItem || isInItemRange ) && 'group-hover:block'} z-10 top-1 right-1 cursor-pointer absolute hidden rounded-full`}>
                {showItemRange && isInItemRange && (
                    <GridDeleteIcon
                        onClick={() => {
                        onDeleteItme(dayItem.id)
                            setShowItemRange(false);
                            setSelectedItem(null);
                            setSelectedItemSch(null);
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
                            setSelectedItemSch(null);
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

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CustomDateRangPicker(props) {
    const { onRangeChange, dayItems, onDeleteItme, className, onMonthChange, scheduleState } = props;
    const [showItemRange, setShowItemRange] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemSch, setSelectedItemSch] = useState(null);
    const [dateRange, Dispatch] = useReducer(dateRangeReducer,
        {
            start: dayjs(),
            end: dayjs(),
        });
    const [calendarView, setCalendarView] = useState('day');
    
    useEffect(() => {
        if ( !selectedItem?.id || selectedItem?.type === 'absence') return;
        (async () => {
            const sch = await ScheduleAPI.get(selectedItem.id);
            setSelectedItemSch({
                itemStartDate: dayjs(sch.initial_date),
                itemEndDate: dayjs(sch.end_date),
            });
        })()   
    }, [selectedItem])

    useEffect(() => {
        onRangeChange(dateRange.start, dateRange.end)
    }, [dateRange])

    useEffect(() => {
        const element = document.querySelector(
            '.css-1t0788u-MuiPickersSlideTransition-root-MuiDayCalendar-slideTransition'
        );
        // Now you can manipulate the element, e.g., change its background color
        element.style.height = '600px';

    })

    useEffect(() => {
        Dispatch({ type: 'reset' });
        setShowItemRange(false);
    },[scheduleState?.id])

    return (
        <div className={`${className} relative`}>
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
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
            >
                <DateCalendar
                    onMonthChange={(month) => {
                        onMonthChange(month);
                    }}
                    onViewChange={(view) => setCalendarView(view)}
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
                            setSelectedItem,
                            selectedItemSch,
                            setSelectedItemSch
                        },
                        calendarHeader: {
                            className: ' '
                        },
                    }}
                />
            </LocalizationProvider>
            <div className={`${calendarView !== 'day' && 'hidden'} absolute inset-x-0 h-10 px-[46px] z-0 bg-white flex items-center top-[88px]`}>
                <div className='   flex justify-between w-full'>
                    {
                        daysOfWeek.map((day, i) => (
                            <Typography key={i} className='w-[80px] text-center text-blue-gray-600 font-semibold' >
                                {day}
                            </Typography>
                        ))
                    }
                </div>
            </div>
        </div>

    );
}