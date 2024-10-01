import React, { useCallback, useEffect, useId, useState } from 'react'
import { Tabs, TabsHeader, Tab, IconButton, List, ListItem, Typography, Button } from '@material-tailwind/react'
import { CustomDateRangPicker } from './CustomDateRangPicker';
import { reccurencs } from '../../consts';
import { useSnackbar } from 'notistack';
import { ScheduleAPI } from '../../apis/ScheduleAPI';
import { UserAPI } from '../../apis/UserAPI';
import dayjs from 'dayjs';
import { useScheduleDefine } from '../../hooks/useScheduleDefine';
import { CustomDialog } from '../Global/CustomDialog';
import {Loading} from '../../components/Global/Loading'

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
  const { selecetedDays, handelToggleDay, handelToggleDays, scheduleDays, scheduleMutation, isLoading, saveNewSchedules, isPending, clearSelcectedDays } = useScheduleDefine(scheduleState, currentMonth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);



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
      case 'equipment': case 'surface': case 'thermometer':
        handeldeleteSchedule(id);
        break;
      default:
        break;
    }
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
        <div className='absolute z-30 right-20 top-[18px]  flex justify-end  '>
          {!isEditting ?
            (<Button ripple={false}
              onClick={() => setIsEditting(true)}
              className='text-md px-2 tracking-wider py-1 text-yellow-800 ' variant='text'>
              Edit
            </Button>) :
            (<>
              <Button ripple={false}
                onClick={() => { setIsDialogOpen(true);  }}
                className='text-md px-2 tracking-wider py-1 text-green-800 ' variant='text'>
                save
              </Button>
              <Button
                onClick={() => { clearSelcectedDays(); }}
                className='text-md px-2 tracking-wider py-1 text-red-600 ' variant='text'>
                Clear
              </Button>
              <Button
                onClick={() => { setIsEditting(false);  }}
                className='text-md px-2 tracking-wider py-1 text-orange-600 ' variant='text'>
                cnacel
              </Button>

            </>)
          }
        </div>

        {
          isLoading && isPending (
            <Loading/>
          )
        }
        
        <CustomDateRangPicker
          onSelectedDaysChang={handelToggleDays}
          onSelectedDayChange={handelToggleDay}
          selecetedDays={isEditting ? selecetedDays : scheduleDays}
          className='space-y-8  border shadow rounded-lg bg-white'
          onDeleteItme={(id) => {
            handeleDeleteItem(id);
          }}
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
          subTitle='this action will replace new scedules wiht old ones and will delete the all the logs associated wiht them'
          confirmText='save'
          onClose={() => setIsDialogOpen(false)}
          onCancel={() =>  setIsDialogOpen(false)}
        onConfirm={() => {
          saveNewSchedules();
          setIsEditting(false);
          setIsDialogOpen(false);
          }}
        />}

      {/* <div className='bg-white  p-2  rounded-lg '>
        <div className='space-y-4'>
          <Typography className='flex flex-col justify-between items-center'>
            <span className='mr-4  font-normal text-gray-600'>
              START:
            </span>
            <span className='font-bold text-primary text-xl'>
              {
                scheduleState?.startDate.format('YYYY-MM-DD')
              }
            </span>
          </Typography>
          <Typography className='flex flex-col justify-between items-center'>
            <span className='mr-4  font-normal text-gray-600'>
              END:
            </span>
            <span className='font-bold text-primary text-xl'>
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

      </div> */}
    </div>
  )
}
