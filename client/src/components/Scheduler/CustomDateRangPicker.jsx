import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { useReducer } from 'react';
import { NewspaperTwoTone } from '@mui/icons-material';
import { List, ListItem } from '@material-tailwind/react';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';
import { Divider } from '@mui/material';

const pre_maidRanges = [
    { value: 'reset', label: 'Reset' },
    {value: 'current week', label:'Current Week'},
    { value: 'next week', label: 'Next Week' },
    { value: 'current month', label: 'Currrent Month' },
    { value: 'next month', label: 'Next Month' },
    { value: 'current year', label: 'Current Year' },
    {value: 'next year', label: 'Next Year'},
    { value: 'reset start', label: 'Reset From' },
    { value: 'reset end', label: 'Reset To' },
    // {vaule : '', label: ''},
    // {vaule : '', label: ''},


]

function CalendarDay(props) {
    const { day, Dispatch, outsideCurrentMonth, dateRange, isSelected, className, ...other } = props;
    // console.log("🚀 ~ CalendarDay ~ other:", day)
    const isInRange = day.isAfter(dateRange.start, 'day') && day.isBefore(dateRange.end, 'day');
    return (
        <div
            key={props.day.toString()}

        >
            <PickersDay onClick={() => Dispatch({ type: 'dayclicked', day })} className={`
                ${isInRange && '!bg-blue-gray-100 !text-gray-900 !font-normal'}
                ${day.isSame(dateRange.start, 'day') && '!bg-primary text-white'}
                ${day.isSame(dateRange.end, 'day') && '!bg-primary text-white'}
                ${className}
                !rounded
                `} {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
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

export function CustomDateRangPicker({ onRangeChange, className }) {
    const [dateRange, Dispatch] = useReducer(dateRangeReducer,
        {
            start: dayjs(),
            end: dayjs(),
        });

    useEffect(() => {
        onRangeChange(dateRange.start, dateRange.end)
    }, [dateRange])

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

                    className='w-[600px] '
                    value={dayjs(dateRange.start.format('YYYY-MM-DD'))}

                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: CalendarDay,
                    }}

                    slotProps={{
                        day: {
                            Dispatch,
                            dateRange,
                            className: 'px-10 rounded-none !border-none'
                        },
                        calendarHeader: {
                            // className: '!w-[600px] !h-[800px]'
                        },
                        dayCalendar: {
                            className: 'w-[1000px]'
                        }

                    }}
                />
            </LocalizationProvider>
        </div>

    );
}