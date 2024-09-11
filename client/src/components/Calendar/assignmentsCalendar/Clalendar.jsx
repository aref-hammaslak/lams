import {
    Grid, Paper, Stack, Typography, Divider, Breadcrumbs,

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight.js";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useState } from "react";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useAuth from "../../../hooks/useAuth.js";
import { LabAPI } from "../../../apis/LabAPI.js";
import DayContext, { DayMap } from "../../../contexts/DayProvider.jsx";
import useTask from "../../../hooks/useTask.js";
import CalendarDay from "./CalendarDay.jsx";
import { Spinner } from "@material-tailwind/react";
import { useGetUserRole } from "../../../hooks/useGetUserRole.js";



const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar = (props) => {
    const { filter } = props;
    const { days, setDays, currDate, setCurrDate, nextMonth, prevMonth, filteredDays, seFilteredDays } = useContext(DayContext);
    
    const role = useGetUserRole();
    const { loading } = useTask({ isAdmin: role === 'admin' || role === 'supervisor' ? true : false });
    const today = dayjs().startOf("day");

    const applyFilter = useCallback(function (day) {
        const { tasks } = day;
        if (!filter.type) return day;
        const newTasks = tasks?.filter((task) => {
            switch (filter?.type) {
                case 'equip':
                    return task.logTemplate?.equipment?._id === filter.id;
                case 'staff':
                    return task.user._id === filter.id;

                default:
                    break;
            }
        })
        
        return {
            ...day,
            tasks:newTasks
        }
    }, [filter]);

    useEffect(() => {
        const newDays = new DayMap(
            Array.from(days, ([key, value]) => [dayjs(key), applyFilter(value, key, days)])
        );
        seFilteredDays(newDays)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days])
    
    useEffect(() => {
        const newDays = new DayMap(
            Array.from(days, ([key, value]) => [dayjs(key), applyFilter(value, key, days)])
        );
        seFilteredDays(newDays);

    }, [filter])

    return (
        <>

            <Grid
                container direction="column" padding="1rem" alignItems="center" justifyContent="center" color={{}} className="  p-0 !pb-10"
            >
                {/*render date peaker , schedule type selector , the current month typography */}
                <Grid item alignSelf="stretch" alignItems='center' mb="2rem" className="">

                    <Stack direction="row" spacing="2rem">
                        <IconButton size="large" onClick={prevMonth} color="primary">
                            <ChevronLeftIcon />
                        </IconButton>
                        <DatePicker
                            className="bg-white"
                            format="YYYY-MM"
                            views={["year", "month"]}
                            value={currDate}
                            onChange={(newDate) => setCurrDate(newDate)}
                        />
                        <IconButton size="large" onClick={nextMonth} color="primary">
                            <ChevronRightIcon />
                        </IconButton>

                        <Typography
                            variant="h4"
                            marginLeft="auto !important"
                            color="primary"
                            fontWeight="800"
                            alignContent='center'
                        >
                            {currDate.format("MMMM YYYY")}
                        </Typography>
                    </Stack>
                </Grid>

                <Grid
                    item container columns={7} flexGrow={1} className=' rounded' component={Paper} >
                    {daysOfWeek.map((day, index) => (
                        <Grid item xs={1} key={index} className='border-x bg-secondry py-2'>
                            <Typography className='font-bold text-center ' fontWeight="bold" >{day}</Typography>
                        </Grid>
                    ))}
                    {
                        Array.from(filteredDays, (([, day], key) => (
                            <Grid
                                item key={key} xs={1}
                                className=' pt-2 border border-secondry min-w-[130px] flex flex-col h-[86px]  relative '
                            >
                                <div className={`absolute ${!day.mute && 'hidden'} inset-0 z-10 backdrop-blur-sm bg-white/30`} />
                                <p className='mr-2 text-end'>
                                    {
                                        day.date.isSame(today) ? <span className="text-primary">Today</span> : day.date.date()
                                    }
                                </p>
                                <Divider />
                                <CalendarDay key={key} content={day} />
                                {/* {loading ?
                                    <div className="flex items-center justify-center flex-1 !text-secondry"><Spinner className="w-5 h-5" /></div> :
                                    <CalendarDay key={key} content={day} />} */}

                            </Grid>
                        )))
                    }

                </Grid>
            </Grid>

        </>
    );
}