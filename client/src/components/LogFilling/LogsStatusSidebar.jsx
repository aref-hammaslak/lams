import React, {useState, useEffect} from 'react'
import { EquAPI } from '../../apis/EquAPI';
import { UserAPI } from '../../apis/UserAPI';
import { List, ListItem , Tab, Tabs, TabsHeader, TabPanel , TabsBody } from "@material-tailwind/react";

const initialData = [
    {
        label: 'All',
        value: 'all',
        items: []
    },
    {
        label: 'Staff',
        value: 'staff',
        items: []
    },
    {
        label: 'Equipments',
        value: 'equip',
        items: []
    }
]

export const LogsStatusSidebar = (props) => {
    const {onFilterChange , filter} = props;
    const [sidebarData, setSidebarData] = useState(initialData);

    useEffect(() => {
        const deserialize = (staff, equips) => {
            const deserializedStaff = staff.map((staff) => {
                return { id: staff._id, name: staff.name, active: staff.active }
            }).filter((staff) => staff.active);

            const deserializedEquip = equips.map(equip => {
                return {
                    id: equip._id,
                    name: equip.name,
                }
            })
            return { deserializedEquip, deserializedStaff };
        }

        const fetchdata = async () => {
            const equipments = await EquAPI.getAll();
            const staff = await UserAPI.getAll();
            const { deserializedEquip, deserializedStaff } = deserialize(staff, equipments);
            const data = [

                {
                    label: 'All',
                    value: 'all',
                    items: []
                },
                {
                    label: 'Staff',
                    value: 'staff',
                    items: deserializedStaff
                },
                {
                    label: 'Equipments',
                    value: 'equip',
                    items: deserializedEquip
                }
            ];
            setSidebarData(data);
        }
        fetchdata();

    }, [])

    
  return (
      <Tabs value={filter.type === null ? 'all' : filter.type}>
          <TabsHeader className='px-4 py-4 border-b shadow-md !rounded-none'>
              {
                  sidebarData.map(({ label, value }, i) => (
                      <Tab key={i} value={value} onClick={onFilterChange.bind(null, null, null)}>
                          {label}
                      </Tab>
                  ))
              }
          </TabsHeader>
          <TabsBody animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
          }}>
              {
                  sidebarData.map(({ value, items }, i) => (
                      <TabPanel key={i} value={value}>
                          <List>
                              {items.map(({ name, id }) => (
                                  <ListItem key={id} onClick={onFilterChange.bind(null, id, value)} className={  `${filter.id === id && 'bg-primary text-white' } border-b hover:text-white hover:bg-primary focus:text-white focus:bg-primary  `}>
                                      {name}
                                  </ListItem>
                              ))}
                          </List>

                      </TabPanel>
                  ))
              }
          </TabsBody>
      </Tabs>
  )
}
