import React, { useCallback, useState } from 'react'
import { Tabs, TabsHeader, Tab, IconButton, List, ListItem, Typography, Button } from '@material-tailwind/react'
import { CustomDateRangPicker } from './CustomDateRangPicker';
import { DateField } from '@mui/x-date-pickers';
import { Divider } from '@mui/material';
import { reccurencs } from '../../consts';
import { useSnackbar } from 'notistack';
import { ScheduleAPI } from '../../apis/ScheduleAPI';
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

  const handelAddSchedule = async () => {
    setLoading(true);
    let { id, type, recurrence, startDate, endDate } = scheduleState;
    endDate = endDate.add(1, 'day').format('YYYY-MM-DD');
    startDate = startDate.format('YYYY-MM-DD');
    try {
      await ScheduleAPI.create(type, id, startDate, endDate, reccurencs[recurrence])
      enqueueSnackbar('Schedule added successfully', {variant:'success'});
    } catch (error) {
      console.log(error);
      if (error.response.data.error) {
        enqueueSnackbar(error.response.data.error, { variant: 'error' })
      }
    } finally {
      setLoading(false);
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
  return (
    <div className='p-8 flex gap-8 items-center mx-auto '>
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
      <CustomDateRangPicker className='space-y-8 border shadow rounded-lg bg-white' onRangeChange={handelRangeChange} />
      <div className='bg-white space-y-8 p-4  rounded-lg '>
        <div className='space-y-4'>
          <Typography className='flex justify-between'>
            <span className='mr-4 text-sm font-normal text-gray-600'>
              FROM:
            </span>
            <span className='font-bold text-blue-gray-800 text-lg'>
              {
                scheduleState?.startDate.format('YYYY-MM-DD')
              }
            </span>
          </Typography>
          <Typography className='flex justify-between'>
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


        <Button className='w-full bg-primaryDark' onClick={handelAddSchedule} disabled={loading}>
          Add schedule
        </Button>


      </div>
    </div>
  )
}
