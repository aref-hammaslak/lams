import React, { useCallback, useEffect, useId, useState } from 'react'
import { Tabs, TabsHeader, Tab, IconButton, List, ListItem, Typography, Button } from '@material-tailwind/react'
import { CustomDateRangPicker } from './CustomDateRangPicker';
import { useSnackbar } from 'notistack';
import { UserAPI } from '../../apis/UserAPI';
import dayjs from 'dayjs';
import { useScheduleDefine } from '../../hooks/useScheduleDefine';
import { CustomDialog } from '../Global/CustomDialog';
import { Loading } from '../../components/Global/Loading'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { Tooltip } from '@mui/material';
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";

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
  const { enqueueSnackbar } = useSnackbar();
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [isEditting, setIsEditting] = useState(false);
  const { selecetedDays, handelToggleDay, handelToggleDays, scheduleDays, scheduleMutation, isLoading, saveNewSchedules, isPending, clearSelcectedDays, copySchedulesOfMonth } = useScheduleDefine(scheduleState, currentMonth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsEditting(false);
  }, [scheduleState.id])

  const getMonthItems = () => {
    const items = []
    for (let i = 1; i < 13; i++){
      const month = dayjs(currentMonth).subtract(i, 'month');
      const item =<MenuItem key={i} onClick={() => copySchedulesOfMonth(month)}>
        {
          month.format('MMMM')
        }
      </MenuItem>
      items.push(item);
    }
    return items;
  }


  const handleRecurrChange = (newRecurr) => {
    dispatchSchedule({
      type: 'recurrence',
      recurrence: newRecurr,
    })
  }

  return (
    <div className=' flex  gap-4 items-center   '>
      {
        scheduleState?.type !== 'staff' && (
          <Tabs value={scheduleState?.recurrence} className='border-b rounded-lg px-2 pb-2 flex !justify-between  z-10 bg-primaryLight'>

            <TabsHeader
              className=" scrollbar-thin scrollbar-track-rounded m-auto rounded-none h-[230px] overflow-y-auto flex flex-col   border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  " border-b-2 !w-[30px] !top-0 !left-[20px] bg-transparent  border-primary shadow-none rounded-none hidden",
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
      <div className='relative'>
        <div className='absolute z-30  right-20 top-[18px]  flex justify-end items-center'>
          {!isEditting ?
            (<Button ripple={false}
              onClick={() => setIsEditting(true)}
              className='text-md px-2 tracking-wider    py-1 text-yellow-800 ' variant='text'>
              Edit
            </Button>) :
            (<>
              <Menu>
                <MenuHandler className="cursor-pointer">
                    <Tooltip title="Insert predefined schedules">
                      <ArrowDropDownCircleIcon className='text-gray-700' />
                    </Tooltip>
                </MenuHandler>
                <MenuList className='h-[200px] scrollbar-thin'>
                  {
                    getMonthItems()
                  }
               </MenuList>
              </Menu>

              <Button ripple={false}
                onClick={() => { setIsDialogOpen(true); }}
                className='text-md px-2 tracking-wider py-1 text-green-800 ' variant='text'>
                save
              </Button>
              <Button
                onClick={() => { clearSelcectedDays(); }}
                className='text-md px-2 tracking-wider py-1 text-red-600 ' variant='text'>
                Clear
              </Button>
              <Button
                onClick={() => { setIsEditting(false); }}
                className='text-md px-2 tracking-wider py-1 text-orange-600 ' variant='text'>
                cnacel
              </Button>

            </>)
          }
        </div>

        {
          isLoading && isPending(
            <Loading />
          )
        }

        <CustomDateRangPicker
          onSelectedDaysChang={handelToggleDays}
          onSelectedDayChange={handelToggleDay}
          selecetedDays={isEditting ? selecetedDays : scheduleDays}
          className='space-y-8  border shadow rounded-lg bg-white'
          selectionDisabled={!isEditting}
          currentMonth={currentMonth}
          scheduleState={scheduleState}
          onMonthChange={(month) => {
            setIsEditting(false);
            setCurrentMonth(month);
          }}
        />

      </div>
      {isDialogOpen &&
        <CustomDialog
          title='Are you sure to save items?'
          subTitle='this action will replace new scedules wiht old ones and will delete all the logs associated wiht them'
          confirmText='save'
          onClose={() => setIsDialogOpen(false)}
          onCancel={() => setIsDialogOpen(false)}
          onConfirm={() => {
            saveNewSchedules();
            setIsEditting(false);
            setIsDialogOpen(false);
          }}
        />}
    </div>
  )
}
