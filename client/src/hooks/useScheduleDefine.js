import { useState } from "react";
import { UserAPI } from "../apis/UserAPI";
import { ScheduleAPI } from "../apis/ScheduleAPI";
import { reccurencs } from "../consts";
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from "dayjs";
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query'
import { exact } from "prop-types";
import { Alert } from "react-bootstrap";
import { useAuth } from '../hooks/useAuth'


export const useScheduleDefine = (scheduleState, currentMonth) => {
    const [selecetedDays, setSelectedDays] = useState([]);
    const queryClient = useQueryClient();
    const [scheduleIds, setScheduleIds] = useState([]);
    const [absenceIds, setAbsenceIds] = useState([]); 
    const { enqueueSnackbar } = useSnackbar();
    const { auth: { id: userId } } = useAuth()


    const handelToggleDays = (days, beIncluded) => {

        const all = new Set([...days, ...selecetedDays])
        const newSelectedDays = [];
        for (const day of all) {
            switch (beIncluded) {
                case true:

                    // make sure to only one column be selected in weekly recurrence
                    if (scheduleState.recurrence === 1 && selecetedDays.length > 0) break;
                    newSelectedDays.push(day);
                    break;
                case false:
                    if (days.includes(day)) continue;
                    else newSelectedDays.push(day);
                    break;
                default:
                    break;

            }
        }
        setSelectedDays(newSelectedDays.sort((a, b) => a - b));
    }

    const handelToggleDay = (day) => {

        //don't allow to selecte more than on day if recurrence is not daily or weekly
        if (scheduleState.recurrence === 1) return;
        if (scheduleState.recurrence > 1 && selecetedDays.length > 0) return setSelectedDays([day]);


        if (selecetedDays.includes(day)) {
            const newDays = [...selecetedDays].filter(d => d !== day);
            setSelectedDays(newDays);
        }
        else
            setSelectedDays([...selecetedDays, day].sort((a, b) => a - b));
    }

    const clearSelcectedDays = () => {
        setSelectedDays([]);
    }

    const fetchAbsencesScheduleData = async () => {
        const { id: userId } = scheduleState;
        const staff = await UserAPI.get(userId, {
            expand_absences: true,
            from: currentMonth,
            to: currentMonth.endOf('month')

        })
        const { absences } = staff;
        return absences;
    }

    const fetchESTScheduleData = async () => {
        const { id: itemId } = scheduleState;
        const schedules = await ScheduleAPI.getAll(
            itemId,
            currentMonth.format('YYYY-MM-DD'),
            currentMonth.endOf('month').format('YYYY-MM-DD'),
            undefined,
            undefined,
            'date',
            reccurencs[scheduleState.recurrence],
        )
        return schedules;
    }

    const handelDeleteAbsences = (absIds) => {
        const delPromices = [];
        for (const absId of absIds) {
            const req = UserAPI.updateUser(userId, {}, {
                delete_absence: true,
                absence_id: absId
            });
            delPromices.push(req);
        }
        return delPromices;
    }


    const getRanges = () => {
        const ranges = [];
        let rangeStart = currentMonth.add(selecetedDays[0] - 1, 'day');
        let rageEnd;

        for (let i = 0; i < selecetedDays.length; i++) {

            rageEnd = currentMonth.add(selecetedDays[i] - 1, 'day');

            // check if there is no next item save the final range and break the loop
            if (!selecetedDays[i + 1]) {
                ranges.push({
                    startDate: rangeStart.format('YYYY-MM-DD'),
                    endDate: rageEnd.add(1, 'day').format('YYYY-MM-DD')
                })
                break;
            }

            let nextDate = currentMonth.add(selecetedDays[i + 1] - 1, 'day');
            // check the differece , if greather than one save the range 
            if (rageEnd.diff(nextDate, 'day') < -1) {
                ranges.push({
                    startDate: rangeStart.format('YYYY-MM-DD'),
                    endDate: rageEnd.add(1, 'day').format('YYYY-MM-DD')
                })
                rangeStart = nextDate;
            }
        }
        return ranges;
    }


    const schsMutFn = async () => {

        // if ther are some schedules in current month all will be deleted
        scheduleIds.length && await ScheduleAPI.destroy(scheduleIds.join(','));
        
        // if there is no day to add scedule retrun null
        if (!selecetedDays.length) return null;

        let { id, type, recurrence } = scheduleState;

        // I added retrun the [1] to array be iterable for recurrences greather than 0;
        const scheduleRanges = scheduleState.recurrence === 0? getRanges() : [1];

        const schedules = scheduleRanges.map(({ startDate, endDate }) => {

            //for not daily recurrence set the initialDate to the only selected day and  the endDate to end of the current month
            startDate = scheduleState.recurrence > 0 ? currentMonth.add(selecetedDays[0] -1, 'day') : startDate
            endDate = scheduleState.recurrence > 0 ?
                currentMonth.endOf('month').add(1, 'day') :
                endDate;

            return {
                initial_date: startDate,
                end_date: endDate,
                recurrence: reccurencs[recurrence]
            }
        })
        const res = await ScheduleAPI.create(type, id, schedules);
        return res;
    }
    const abssMutFn = async () => {
        absenceIds.length && await UserAPI.updateUser(scheduleState.id, {
            absenceIds 
        }, {  
            delete_absences: true
        })

        const newAbsences = getRanges();
        // alert(JSON.stringify(newAbsences));
        const res = UserAPI.updateUser(scheduleState.id, {
            newAbsences
        }, {
            add_absences:true
        })
        return res;
    }


    const { mutate: mutateSchedules, isPending } = useMutation({
        mutationKey: ['mutateSchedules'],
        mutationFn: async () => {

            try {
                if (scheduleState.type === 'staff') {
                    return await abssMutFn();
                }
                if (scheduleState !== 'staff' ) {
                    return await schsMutFn();
                }

            } catch (error) {
                alert(error);
                console.log(error);
                if (error.response.data.error) {
                    const err = error.response.data.error;
                    enqueueSnackbar(err, { variant: 'error' })
                    throw new Error(err);
                }
            }
        },
        onSuccess: async () => {
            enqueueSnackbar('Schedules saved sccussfully!', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['schedules', scheduleState, currentMonth] });
        }
    })

    const saveNewSchedules = () => {
        mutateSchedules();
    }

    const { data: scheduleDays, isLoading } = useQuery({
        queryKey: ['schedules', scheduleState, currentMonth],
        queryFn: async () => {
            if (scheduleState?.type !== 'staff') {
                const scheduleDays = await fetchESTScheduleData();

                const schIds = [...new Set(Object.values(scheduleDays).map(([item]) => item._id))];
                setScheduleIds(schIds);

                const days = Object.keys(scheduleDays).map(date => dayjs(date).date());
                setSelectedDays(days);
                return days;
            } else {
                const absences = await fetchAbsencesScheduleData();
                // alert(JSON.stringify(absences));
                const days = [];
                const absIds = [];
                absences.forEach(abs => {
                    absIds.push(abs.absence_id);
                    days.push(dayjs(abs.date).date());
                });
                setSelectedDays(days);
                setAbsenceIds([...new Set(absIds)]);
                return days;
            }
        },
        initialData: []
    })



    return {
        selecetedDays,
        scheduleDays,
        isLoading,
        handelToggleDay,
        handelToggleDays,
        saveNewSchedules,
        isPending,
        clearSelcectedDays
    }
}
