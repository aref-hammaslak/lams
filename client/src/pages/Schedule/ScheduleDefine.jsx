import React, { useEffect, useReducer, useState } from 'react'
import { List, ListItem } from '@material-tailwind/react'
import { LogTmpAPI } from '../../apis/LogTmpAPI';
import { useSnackbar } from 'notistack';
import { SurfAPI } from '../../apis/SurfAPI';
import { ThermAPI } from '../../apis/ThermAPI';
import { Scheduler } from '../../components/Scheduler/Scheduler';
import { reccurencs } from '../../consts';
import { TabsSidebarLayout } from '../../layouts/TabsSidebarLayout';
import { UserAPI } from '../../apis/UserAPI';
import PageHeader from '../../components/Global/PageHeader';

const scheduleReducer = (prevState, action) => {
  switch (action.type) {
    case 'item': {
      let type;
      let recurrence = 0;
      switch (action.itemType) {
        case 'staff':
          type = 'staff';
          recurrence = null;
          break;
        case 'equip':
          type = 'equipment';
          recurrence = action.recurrence;
          break;
        case 'surf':
          type = 'surface';
          break;
        case 'therm':
          type = 'thermometer';
          break;
        default:
          break;
      }
      return {
        ...prevState,
        id: action.id,
        name: action.name,
        type: type,
        recurrence,
      }
    }
    case 'dateRange': {
      return {
        ...prevState,
        startDate: action.start,
        endDate: action.end
      }
    }
    case 'recurrence': {
      return {
        ...prevState,
        recurrence: action.recurrence
      }
    }
    default:
      break;
  }
}

const tabs = [
  { label: 'Staff', value: 'staff', title: 'Schedule Staff Absences', subtitle: 'Plan and track staff absences' },
  { label: 'Equipment', value: 'equip', title: 'Schedule Equipment Logs', subtitle: 'Plan and track upcoming maintenance and performance checks for lab equipments' },
  { label: 'Surfase', value: 'surf', title: 'Schedule Surfaces', subtitle: 'Plan and track cleaning schedules for surfaces' },
  { label: 'Thermometer', value: 'therm', title: 'Schedule Thermometers', subtitle: 'Plan and track  maintenance checks for thermometers' }]

export const ScheduleDefine = () => {
  const [activeTab, setActiveTab] = useState('equip'); // staff | equip | surf | therm
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [items, setItems] = useState(null);
  const [scheduleState, dispatchSchedule] = useReducer(scheduleReducer, null);
  const { enqueueSnackbar } = useSnackbar();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      let fetchResponse;
      try {
        switch (activeTab) {
          case 'staff': {
            fetchResponse = await UserAPI.getAll();
            const staff = fetchResponse.filter(staff => staff.active).map(staff => {
              return {
                id: staff._id,
                name: staff.username,
                type: 'staff',
              }
            })
            setItems(staff);
            break;
          }
          case 'equip': {
            fetchResponse = await LogTmpAPI.getAll();
            const equips = fetchResponse.map(logTemp => {
              return {
                id: logTemp._id,
                name: <p>{logTemp.eq_details[0].name} <span className='font-bold text-sm rounded-full text-black bg-primaryLight py-1 px-2'>{reccurencs[logTemp.type].at(0).toLocaleUpperCase()}</span></p>,
                // name: `${logTemp.eq_details[0].name} <span>[${reccurencs[logTemp.type].at(0)}]</span>`,
                recurrence: logTemp.type,
                type: 'equip'

              }
            }).filter((item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
            );
            setItems(equips);
            break;
          }
          case 'surf': {
            fetchResponse = await SurfAPI.getAll();
            const surfaces = fetchResponse.map(surface => {
              return {
                id: surface._id,
                name: surface.name,
                type: 'surf'
              }
            });
            setItems(surfaces);
            break;
          }
          case 'therm': {
            fetchResponse = await ThermAPI.getAll();
            const thermometers = fetchResponse.map(thermometer => {
              return {
                id: thermometer._id,
                name: thermometer.name,
                type: 'therm'
              }
            });
            setItems(thermometers);
            break;
          }
          default:
            break;
        }
      } catch (error) {
        console.log("🚀 ~ useEffect ~ error:", error)
        enqueueSnackbar(error.message);
      }

    }
    fetchData();
  }, [activeTab, enqueueSnackbar])

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
  }

  const handelItemClick = (id, name, itemType, recurrence) => {
    dispatchSchedule({
      type: 'item',
      id,
      name,
      itemType: itemType || activeTab,
      recurrence,
    })
  }

  useEffect(() => {
    if (!items) return;
    const tabFirstItem = items[0];
    const { id, type, name, recurrence } = tabFirstItem;
    dispatchSchedule({
      type: 'item',
      id,
      name,
      recurrence,
      itemType: type || activeTab
    })
  }, [items]);

  const sidebarElement = <List>
    {items?.map(({ name, id, type, recurrence }) => (
      <ListItem key={id} color='bg-primary' className={` border-b text-lg hover:text-white hover:bg-primary focus:bg-primary  focus:text-white ${scheduleState?.id === id && 'bg-primary text-white'}  `}
        onClick={() => handelItemClick(id, name, type, recurrence)}
      >
        {name}
      </ListItem>
    ))}
  </List>

  return (
    <>
      <TabsSidebarLayout tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} sidebarElement={
        sidebarElement
      } >
        <div className='p-8 mx-auto space-y-4'>
          <PageHeader
            title={tabs.find(tab => tab.value === activeTab).title}
            subtitle={tabs.find(tab => tab.value === activeTab).subtitle}
          />
          <Scheduler scheduleState={scheduleState} dispatchSchedule={dispatchSchedule} />
        </div>
      </TabsSidebarLayout>
    </>
  )
}
