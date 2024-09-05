import React, { useCallback, useEffect, useId, useState } from 'react'
import { Tabs, TabsHeader, Tab, IconButton, List, ListItem, Typography, Button } from '@material-tailwind/react'
import { CustomDateRangPicker } from './CustomDateRangPicker';
import { DateField } from '@mui/x-date-pickers';
import { Divider } from '@mui/material';
import { reccurencs } from '../../consts';
import { useSnackbar } from 'notistack';
import { ScheduleAPI } from '../../apis/ScheduleAPI';
import { UserAPI } from '../../apis/UserAPI';
import dayjs from 'dayjs';
import { ResetTvRounded } from '@mui/icons-material';

const tabs = [
  { label: 'Daily', value: 0 },
  { label: 'Weekly', value: 1 },
  { label: 'Monthly', value: 2 },
  { label: 'Quarterly', value: 3 },
  { label: 'Semiannually', value: 4 },
  { label: 'Annually', value: 5 }
]

export const Scheduler = (props) => {
  const { scheduleState, dispatchSchedule } = props;
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [dayItems, setDayItems] = useState(new Map());
  const [refreshDayItems, setRefreshDayItems] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));

  const handelAddSchedule = async () => {
    setLoading(true);
    let { id, type, recurrence, startDate, endDate } = scheduleState;
    endDate = endDate.add(1, 'day').format('YYYY-MM-DD');
    startDate = startDate.format('YYYY-MM-DD');
    try {
      await ScheduleAPI.create(type, id, startDate, endDate, reccurencs[recurrence])
      enqueueSnackbar('Schedule added successfully', { variant: 'success' });
      setRefreshDayItems(n => !n);
    } catch (error) {
      console.log(error);
      if (error.response.data.error) {
        enqueueSnackbar(error.response.data.error, { variant: 'error' })
      }
    } finally {
      setLoading(false);
    }
  }

  const handelAddAbsence = async () => {
    const { id: userId } = scheduleState;
    console.log("🚀 ~ handelAddAbsence ~ userId:", userId)
    try {
      await UserAPI.updateUser(userId, {
        start_date: scheduleState.startDate,
        end_date: scheduleState.endDate.add(1, 'days'),
      }, {
        add_absence: true
      })
      enqueueSnackbar('Absence added successfully', { variant: 'success' })
      setRefreshDayItems(n => !n);
    } catch (error) {
      console.error(error);
      if (error.response.data) {
        enqueueSnackbar(error.response.data.error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Something went wrong')
      }

    }

  }

  const handeldeleteAbsence = async (absenceId) => {
    const { id: userId } = scheduleState;
    try {
      await UserAPI.updateUser(userId, {}, {
        delete_absence: true,
        absence_id: absenceId
      })
      enqueueSnackbar('Absence deleted successfully', { variant: 'success' })
      setRefreshDayItems(n => !n);
    } catch (error) {
      console.error(error);
      if (error.response.data) {
        enqueueSnackbar(error.response.data.error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Something went wrong')
      }

    }
  }

  const handelRangeChange = useCallback((start, end) => {
    dispatchSchedule({
      type: 'dateRange',
      start,
      end
    })
  }, [dispatchSchedule]);

  const handleRecurrChange = (newRecurr) => {
    dispatchSchedule({
      type: 'recurrence',
      recurrence: newRecurr,
    })
  }

  const handeldeleteSchedule = async (sch_id) => {
    try {
      await ScheduleAPI.destroy(sch_id);
      enqueueSnackbar('schedule deleted successfully', { variant: 'success' })
      setRefreshDayItems(n => !n);
    } catch (error) {
      console.error(error);
      if (error.response.data) {
        enqueueSnackbar(error.response.data.error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Something went wrong')
      }

    }
  }

  const handeleDeleteItem = (id) => {
    switch (scheduleState.type) {
      case 'staff':
        handeldeleteAbsence(id);
        break;
      case 'equipment': case 'surface': case 'thremometer':
        handeldeleteSchedule(id);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (!scheduleState?.id) {
      setDayItems(new Map());
      return;
    }
    const fetchAbsencesScheduleData = async () => {
      try {
        const { id: userId } = scheduleState;
        const staff = await UserAPI.get(userId, {
          expand_absences: true,
          from: currentMonth,
          to: currentMonth.endOf('month')

        })
        const { absences } = staff;
        const dayItems = new Map();
        absences.forEach(absence => {
          dayItems.set(dayjs(absence.date).format('YYYY-MM-DD'), {
            id: absence.absence_id,
            type: 'absence',
            itemStartDate: dayjs(absence.startDate),
            itemEndDate: dayjs(absence.endDate),
          })
        });
        setDayItems(dayItems);
      } catch (error) {

        enqueueSnackbar('Something went wrong', { variant: 'error' });
        throw new Error('something went wrong');
      }


    }
    const fetchESTScheduleData = async () => {
      try {
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
        console.log("🚀 ~ fetchESTScheduleData ~ schedules:", Object.values(schedules))
        const dayItems = new Map();
        Object.values(schedules).map(sch => {
          const sc = sch[0]
          dayItems.set(sch[0].date.split('T')[0], {
            id: sc._id,
            date: sc.date,
          });
        })

        setDayItems(dayItems);
      } catch (error) {

        enqueueSnackbar(error.message, { variant: 'error' });
        throw new Error('something went wrong');
      }
    }
    if (scheduleState.type === 'staff') {
      fetchAbsencesScheduleData();
    } else {
      fetchESTScheduleData();
    }

  }, [scheduleState?.id, refreshDayItems, currentMonth])


  return (
    <div className='p-8 flex gap-8 items-center mx-auto  '>
      {
        scheduleState?.type !== 'staff' && (
          <Tabs value={scheduleState?.recurrence} className='border-b rounded-lg px-4 pb-2 flex !justify-between  z-10 bg-primaryLight'>

            <TabsHeader
              className=" scrollbar-thin scrollbar-track-rounded m-auto rounded-none h-[230px] overflow-y-auto flex flex-col   border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  " border-b-2 w-[60px] !top-0 !left-[20px] bg-transparent  border-primary shadow-none rounded-none hidden",
              }}
            >

              {tabs.map(({ label, value }) => (
                <Tab
                  key={value}
                  disabled={scheduleState?.type === 'equipment' && value !== scheduleState?.recurrence}
                  value={value}
                  onClick={() => handleRecurrChange(value)}
                  className={`${scheduleState?.recurrence === value ? "text-primary  border-primary" : ""} px-0 py-2 border-b-2 !bg-primaryLight text-sm`}
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
        )
      }

      <CustomDateRangPicker
        dayItems={dayItems}
        className='space-y-8  border shadow rounded-lg bg-white'
        onDeleteItme={(id) => {
          handeleDeleteItem(id);
        }}
        scheduleState={scheduleState}
        onRangeChange={handelRangeChange}
        onMonthChange={setCurrentMonth}
      />
      <div className='bg-white  p-4  rounded-lg '>
        <div className='space-y-4'>
          <Typography className='flex justify-between items-center'>
            <span className='mr-4 text-sm font-normal text-gray-600'>
              FROM:
            </span>
            <span className='font-bold text-blue-gray-800 text-lg'>
              {
                scheduleState?.startDate.format('YYYY-MM-DD')
              }
            </span>
          </Typography>
          <Typography className='flex justify-between items-center'>
            <span className='mr-4 text-sm font-normal text-gray-600'>
              TO:
            </span>
            <span className='font-bold text-blue-gray-800 text-lg'>
              {
                scheduleState?.endDate.format('YYYY-MM-DD')
              }
            </span>

          </Typography>
        </div>
        <Divider className='mt-4 mb-8' />

        {
          scheduleState?.type === 'staff' ? (
            <Button className='w-full bg-primaryDark ' onClick={handelAddAbsence} disabled={loading}>
              <span className='tracking-widest'>
                Add absence
              </span>
            </Button>
          ) : (
            <Button className='w-full bg-primaryDark ' onClick={handelAddSchedule} disabled={loading}>
              <span className='tracking-widest'>
                Add schedule
              </span>
            </Button>

          )
        }

      </div>
    </div>
  )
}
