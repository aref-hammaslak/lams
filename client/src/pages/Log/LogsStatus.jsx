import React, { useState, useEffect, useContext } from 'react'
import { EquAPI } from '../../apis/EquAPI';
import { UserAPI } from '../../apis/UserAPI';
import { List, ListItem } from "@material-tailwind/react";
import { Calendar } from '../../components/Calendar/assignmentsCalendar'
import { TabsSidebarLayout } from '../../layouts/TabsSidebarLayout';
import PageHeader from '../../components/Global/PageHeader';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';


import { useGetUserRole } from '../../hooks/useGetUserRole';
import { DailyLogsStepper } from '../../components/LogFilling/DailyLogsStepper';
import { LogsPagination } from '../../components/LogFilling/LogsPagination';
import { logFillingContext } from '../../contexts/LogFillingProvider';
import { Loading } from '../../components/Global/Loading';
import { RefreshProvider } from '../../contexts/RefreshProvider';
import { LogsStatusFilterContext } from '../../contexts/LogsStatusFilterProvider';
import { json } from 'react-router-dom';
import context from 'react-bootstrap/esm/AccordionContext';
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LogsStatus = () => {
  const filterContext = useContext(LogsStatusFilterContext);
  // alert(JSON.stringify(context));

  const [filter, setFilter] = useState(() => {
    
    if (filterContext.filter) {
      const filter = filterContext.filter;
      filterContext.setFilter(null);
      return filter;
    }
    return {};
  });


  const [activeTab, setActiveTab] = useState(() => {
    if (filterContext.filter) return 'staff';
    return 'all';
  }); // all | staff | equip



  const [isSidebarOpen, setIsSidebarOpen] = useState(() => filterContext.filter);
  const [items, setItems] = useState([]);
  const userRole = useGetUserRole();
  const [isDialogOpen, setIsDiologOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole === 'staff') return;
    setLoading(true);
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
            if (!filterContext.filter) {
              handleFilterChange(deserializedEquips[0]?.id, 'equip');
            }
            break;
          }
          case 'staff': {
            const staff = await UserAPI.getAll();
            console.log(staff)
            const deserializedStaff = staff.map((staff) => {
              return { id: staff._id, name: staff.username, active: staff.active }
            }).filter((staff) => staff.active);
            setItems(deserializedStaff)
            // set first item as default filter
            if (!filterContext.filter) {
              handleFilterChange(deserializedStaff[0]?.id, 'staff');
            }
            break;
          }
          default:
            setItems([]);
            break;
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchdata();
  }, [activeTab])

  const handleFilterChange = (id, type) => {
    setFilter({
      id,
      type
    })
  }

  const toggleSidebar = () => {
    if (activeTab === 'all') return;
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

  const handleOpenDialog = () => {
    setIsDiologOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDiologOpen(false);
  };


  const sidebarElement = <>
    {
      loading && <Loading />
    }
    <List className='relative'>

      {items.map(({ name, id }) => (
        <ListItem key={id} onClick={() => handleFilterChange(id, activeTab)} className={`${filter.id === id && 'bg-primary text-white'} border-b hover:text-white hover:bg-primary focus:text-white focus:bg-primary  `}>
          {name}
        </ListItem>
      ))}
    </List>
  </>


  return (
    <RefreshProvider>
      {userRole === 'staff' ?
        (
          <div className='p-8 space-y-4'>
            <PageHeader title='Assignments Overview' subtitle='View, manage and track equipment logs assignments and their status' />
            <Calendar filter={{}} onClickAssignment={handleOpenDialog} />
          </div>
        ) :

        (
          <TabsSidebarLayout tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} sidebarElement={
            sidebarElement
          } >
            <div className='p-8 space-y-4'>
              <PageHeader title='Assignments Overview' subtitle='View, manage and track equipment logs assignments and their status' />
              <Calendar filter={filter} onClickAssignment={handleOpenDialog} />
            </div>
          </TabsSidebarLayout>
        )}

      <>
        <Dialog
          fullScreen
          open={isDialogOpen}
          onClose={handleCloseDialog}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar className='bg-blue-600'>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Log Filling
              </Typography>

            </Toolbar>
          </AppBar>
          <>
            <div className=" container  border p-8   m-auto rounded-lg shadow   ">
              <DailyLogsStepper />
              <div className={"mt-4  "}>
                {<LogsPagination navigatedFromLogsStatus={isDialogOpen} disableColumnSorting disableColumnMenu />}
              </div>
            </div>
          </>
        </Dialog>
      </>
    </RefreshProvider>


  )
}

export { LogsStatus };