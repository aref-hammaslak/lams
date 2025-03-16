import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Typography } from '@material-tailwind/react';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';
import { useState } from 'react';


function CalendarDay(props) {
    const { day, onDayClick, selecetedDays, outsideCurrentMonth, selectionDisabled, className, tabIndex, ...other } = props;

    // const dayItem = dayItems.get(day.format('YYYY-MM-DD'));
    let selectedRangeStyles = '';

    return (
        <div
            className={` ${!outsideCurrentMonth && 'shadow'} relative group  m-[4px] !rounded  border-gray-700 box-border`}
            key={props.day.toString()}

        >
            <PickersDay
                disableTouchRipple
                onClick={() => {
                    onDayClick(day.date());
                }}
                className={`
                ${selecetedDays.includes(day.date()) ?
                        '!bg-primary text-white' :
                        '!bg-white !text-gray-800'}
                ${className}
                !rounded shadow text-[16px] !font-normal
                `}
                {...other}
                outsideCurrentMonth={outsideCurrentMonth} day={day} />

        </div>
    );
}


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CustomDateRangPicker(props) {
    const { currentMonth, dayItems, onDeleteItme, onSelectedDayChange, className, onMonthChange, scheduleState, selectionDisabled, selecetedDays, onSelectedDaysChang } = props;
    const [calendarView, setCalendarView] = useState('day');

    useEffect(() => {
        const xpath = '//*[@id="root"]/main/div/div[2]/div[2]/div/div[2]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!element) return;
        element.style.height = '600px';
    }, [])

    const getRowDays = (row, currentMonth) => {
        const month = dayjs(currentMonth);
        const monthFirstWeekDay = month.startOf('month').day()
        const rowDays = [];
        let rowFirstDay = ((row - 1) * 7 - monthFirstWeekDay);
        let rowDay = rowFirstDay;
        for (let i = 0; i < 7; i++) {
            rowDay += 1;
            if (rowDay > month.daysInMonth() || rowDay < 0) continue;
            rowDays.push(rowDay)
            
        }
        return rowDays;
    }

    const handelToggleRow = (row, isChecked) => {

        const rowDays = getRowDays(row, currentMonth);
        onSelectedDaysChang(rowDays, isChecked);

    }
    const getColDays = (col, currentMonth) => {
        const month = dayjs(currentMonth);
        const monthFirstWeekDay = month.startOf('month').day()
        const colDays = [];
        let colFirstDay = col - monthFirstWeekDay;
        if (monthFirstWeekDay >= col)
            colFirstDay += 7;
        let colDay = colFirstDay;
        for (colDay; colDay <= month.daysInMonth(); colDay += 7) {
            colDays.push(colDay);
        }
        return colDays;
    }
    const handelToggleCol = (col, isChecked) => {

        const colDays = getColDays(col, currentMonth);
        onSelectedDaysChang(colDays, isChecked);
    }

    const isSubsetOf = (arr1, arr2) => {
        const set = new Set([...arr1, ...arr2]);
        return (set.size === arr2.length);
    }
    
    const handelDayClick = (day) => {
        onSelectedDayChange(day);
    }

    //the column slection will be visibel for weekly and daily recurrences and staff absences
    const rowCheckboxesHidden = (calendarView !== 'day'|| scheduleState.recurrence > 0) || selectionDisabled;
    // the row slection will be visibel for dayil and staff absences
    const colChecboxesHidden = (calendarView !== 'day' || scheduleState.recurrence > 1  ) || selectionDisabled;


    return (
        <div className={`${className} relative overflow-hidden`}>

            <LocalizationProvider
                dateAdapter={AdapterDayjs}
            >
                <DateCalendar
                    onMonthChange={(month) => {
                        onMonthChange(month);
                    }}
                    views={['day', 'month']}
                    onViewChange={(view) => setCalendarView(view)}
                    style={{
                        height: 800
                    }}
                    className='!w-[630px] translate-x-3  max-h-[410px] !mt-0'
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: CalendarDay,

                    }}
                    slotProps={{
                        day: {
                            className: 'px-9 py-5  m-0 rounded-none !border-none',
                            dayItems,
                            onDeleteItme,
                            selecetedDays,
                            onDayClick: selectionDisabled ? () => { } : handelDayClick
                        },
                    }}
                />
            </LocalizationProvider>


            <div className={`absolute translate-x-5 inset-x-0 pr-[48px]  h-10 pl-[30px] z-0 bg-white flex items-center top-[25px]`}>
                <div className='   flex justify-between w-full'>
                    {daysOfWeek.map((day, index) => (
                        <div className='flex w-[70px] justify-center gap-2' key={index}>
                            <Typography className=' text-center text-blue-gray-600 font-semibold' >
                                {day}
                            </Typography>
                            <input
                                className={`cursor-pointer ${colChecboxesHidden && 'hidden'}`}
                                checked={(() => {
                                    const colDays = getColDays(index + 1, currentMonth);
                                    return isSubsetOf(colDays, selecetedDays);
                                })()}
                                type='checkbox'
                                onChange={(e) => handelToggleCol(index + 1, e.target.checked)} />
                        </div>
                    ))}
                </div>
            </div>

            {
                !rowCheckboxesHidden && (
                    <div className={` absolute top-[65px]  bg-transparent h-10 left-5 z-0 flex flex-col `}>
                        <div className='   flex justify-between w-full flex-col gap-2.5'>
                            {[1, 2, 3, 4, 5, 6].map((row, i) => {
                                const rowDays = getRowDays(row, currentMonth);
                                
                                return (
                                    <div className={`flex h-[40px] justify-center gap-2
                                        ${rowDays.length == 0 && 'hidden'}
                                        `} key={i}>

                                        <input
                                            className='cursor-pointer'
                                            checked={(() => {
                                                
                                                return isSubsetOf(rowDays, selecetedDays)
                                            })()}
                                            id={i} type='checkbox'
                                            onChange={(e) => handelToggleRow(row, e.target.checked)} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }



        </div>

    );
}