import {
    Grid, Paper, Stack, Typography, Divider, Breadcrumbs,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight.js";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useAuth from "../../../hooks/useAuth.js";
import { LabAPI } from "../../../apis/LabAPI.js";
import DayContext from "../../../contexts/DayProvider.jsx";
import useTask from "../../../hooks/useTask.js";
import CalendarDay from "./CalendarDay.jsx";
import { Spinner } from "@material-tailwind/react";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar = (props) => {
    const navigate = useNavigate();
    const [labs, setLabs] = useState([]);
    const [currentLab, setCurrentLab] = useState(null);
    const { auth, setAuth } = useAuth();
    const { days, currDate, setCurrDate, setDays, nextMonth, prevMonth } = useContext(DayContext);
    const { loading } = useTask({isAdmin: true});
    console.log(days);
    useEffect(() => {
        LabAPI.getAll().then((labs) => {
            setLabs(labs);
            const lab = labs.find((lab) => lab._id === auth.lab_id);
            setCurrentLab(lab);
        });
    }, []);

    const today = dayjs().startOf("day");
    console.log(loading);

    return (
        <>

            <Grid
                container direction="column" padding="1rem" alignItems="center" justifyContent="center" marginTop="2rem" color={{}} className="!bg-white min-w-[1000px] overflow-x-scroll"
            >
                {/*render date peaker , schedule type selector , the current month typography */}
                <Grid item alignSelf="stretch" mb="2rem" >

                    <Stack direction="row" spacing="2rem">
                        <IconButton size="large" onClick={prevMonth} color="primary">
                            <ChevronLeftIcon />
                        </IconButton>
                        <DatePicker
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
                        >
                            {currDate.format("MMMM YYYY")}
                        </Typography>
                    </Stack>
                </Grid>

                {/*render week days on top of grid*/}
                <Grid
                    item container columns={7} component={Paper} className="py-2 rounded-none bg-secondry" >
                    {daysOfWeek.map((day, index) => (
                        <Grid item xs={1} key={index} className='border-x'>
                            <Typography className='font-bold text-center ' fontWeight="bold" >{day}</Typography>
                        </Grid>
                    ))}
                </Grid>

                {/*render the calendar grid and handling user interactions for adding, editing, and deleting schedules*/}
                <Grid
                    item container columns={7} flexGrow={1} className='overflow-x-scroll rounded-none' component={Paper} >
                    {
                        Array.from(days, (([, day], key) => (
                            <Grid
                                item key={key} xs={1}
                                className='px-2 py-2 border border-secondry min-w-[120px] h-[140px] relative '
                            >
                                <div className={`absolute ${!day.mute && 'hidden'} inset-0 z-10 backdrop-blur-sm bg-white/30`} />
                                <p className=' text-end'>
                                    {
                                        day.date.isSame(today) ? <span className="text-primary">Today</span> : day.date.date()
                                    }
                                </p>
                                <Divider />
                                {loading ?
                                    <div className="flex items-center justify-center h-[100px] !text-secondry"><Spinner className="w-5 h-5" /></div> :
                                    <CalendarDay key={key} content={day} />}

                            </Grid>
                        )))
                    }

                </Grid>
            </Grid>

        </>
    );
}