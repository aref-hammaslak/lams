import React, { useEffect, useReducer, useState } from 'react'
import { Tabs, TabsHeader, Tab, IconButton, List, ListItem } from '@material-tailwind/react'
import { GridCloseIcon, GridFilterAltIcon, GridFilterListIcon } from '@mui/x-data-grid';
import { LogTmpAPI } from '../../apis/LogTmpAPI';
import { useSnackbar } from 'notistack';
import { SurfAPI } from '../../apis/SurfAPI';
import { ThermAPI } from '../../apis/ThermAPI';
import { Scheduler } from '../../components/Scheduler/Scheduler';
import { reccurencs } from '../../consts';

const scheduleReducer = (prevState, action) => {
  console.log(action.itemType)
  switch (action.type) {
    case 'item': {
      let type;
      let recurrence =0 ;
      switch (action.itemType) {
        case 'equip':
          type = 'equipment';
          recurrence = action.recurrence;
          console.log("🚀 ~ scheduleReducer ~ action.recurrence:", action.recurrence)
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

const tabs = [{ label: 'Equipment', value: 'equip' }, { label: 'Surfase', value: 'surf' }, { label: 'Thermometer', value: 'therm' }]

export const ScheduleDefine = () => {
  const [activeTab, setActiveTab] = useState('equip'); // equip | surf | therm
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
      async function fetchEquipLotTemps() {
        fetchResponse = await LogTmpAPI.getAll();
      }

      async function fetchSurfaces() {
        fetchResponse = await SurfAPI.getAll();
      }

      try {
        switch (activeTab) {
          case 'equip': {
            fetchResponse = await LogTmpAPI.getAll();
            const equips = fetchResponse.map(logTemp => {
              return {
                id: logTemp._id,
                name: `${logTemp.eq_details[0].name}/${reccurencs[logTemp.type]}`,
                recurrence: logTemp.type,
                type:'equip'

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
                type:'surf'
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
      itemType,
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
      itemType: type
    })
  }, [items]);

return (
  <>

    {/* Nav tabs */}
    <Tabs value={activeTab} className='w-full border-b fixed z-10 bg-white'>
      <IconButton onClick={toggleSidebar}  className='!absolute left-2 top-2 z-20  bg-primaryDark' >
        {
          isSidebarOpen ? 
            <GridCloseIcon /> :
            <GridFilterListIcon/>
        }
      </IconButton>
      <TabsHeader
        className=" w-[600px] m-auto rounded-none  border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            " border-b-2  border-primary shadow-none rounded-none",
          }}
        >

          {tabs.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => handleTabChange(value)}
              className={`${activeTab === value ? "text-primary" : ""} py-4`}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>

      <div className="flex  overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-[122px] bottom-0 left-0 w-64 text-black transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
            } transition-transform duration-300 ease-in-out`}
        >

          <div className="p-4 -ml-2 ">
            <List>
              {items?.map(({ name, id ,type, recurrence}) => (
                <ListItem key={id} color='bg-primary' className={` border-b hover:text-white hover:bg-primary focus:bg-primary  focus:text-white ${scheduleState?.id === id && 'bg-primary text-white'}  `}
                  onClick={() => handelItemClick(id, name, type , recurrence)}
                >
                  {name}
                </ListItem>
              ))}
            </List>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${isSidebarOpen ? 'w-[calc(100vw-256px)] ml-64' : 'w-full'} mt-[58px] h-screen flex flex-col bg-gray-100 duration-300 ease-in-out transition-all`}>
        <Scheduler scheduleState={scheduleState} dispatchSchedule={dispatchSchedule} />
        </div>
      </div>

    </>
  )
}
