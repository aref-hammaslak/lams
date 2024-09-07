import React, { useState, useEffect } from 'react'
import { EquAPI } from '../../apis/EquAPI';
import { UserAPI } from '../../apis/UserAPI';
import { List, ListItem, Tab, Tabs, TabsHeader, TabPanel, TabsBody } from "@material-tailwind/react";
import { Calendar } from '../../components/Calendar/assignmentsCalendar'
import { TabsSidebarLayout } from '../../layouts/TabsSidebarLayout';
const tabs = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Staff',
    value: 'staff',
  },
  {
    label: 'Equipments',
    value: 'equip',
  }
]
const LogsStatus = () => {
  const [filter, setFilter] = useState({  });
  const [activeTab, setActiveTab] = useState('staff');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [items, setItems] = useState([]);


  useEffect(() => {
    const fetchdata = async () => {
      console.log(activeTab);
      try {
        switch (activeTab) {
          case 'equip': {
            const equipments = await EquAPI.getAll();
            const deserializedEquips = equipments.map(equip => {
              return {
                id: equip._id,
                name: equip.name,
              }
            });

            setItems(deserializedEquips);
            // set first item as default filter
            handleFilterChange(deserializedEquips[0]?.id, 'equip');
            break;
          }
          case 'staff': {
            const staff = await UserAPI.getAll();
            console.log(staff)
            const deserializedStaff = staff.map((staff) => {
              return { id: staff._id, name: staff.name, active: staff.active }
            }).filter((staff) => staff.active);
            setItems(deserializedStaff)
            // set first item as default filter
            handleFilterChange(deserializedStaff[0]?.id, 'staff');
            break;
          }
          default:
            setItems([]);
            break;
        }
      } catch (error) {
        console.error(error);
      }

    }
    fetchdata();
  },[activeTab])



  const handleFilterChange = (id, type) => {
    setFilter({
      id,
      type
    })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (newTab) => {

    if (newTab === activeTab) return;
    if (newTab === 'all') {
      setIsSidebarOpen(false);
      setFilter({});
    }
    else !isSidebarOpen && setIsSidebarOpen(true); 
    setActiveTab(newTab);
  }

  
  const sidebarElement = <List>
    {items.map(({ name, id }) => (
      <ListItem key={id} onClick={() => handleFilterChange(id, activeTab)} className={`${filter.id === id && 'bg-primary text-white'} border-b hover:text-white hover:bg-primary focus:text-white focus:bg-primary  `}>
        {name}
      </ListItem>
    ))}
  </List>

  return (

    <TabsSidebarLayout tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} sidebarElement={
      sidebarElement
    } >
      <div className='p-8'>
      <Calendar filter={filter} />
      </div>
    </TabsSidebarLayout>
  )
}

export { LogsStatus };