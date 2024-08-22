import React, {  useState } from 'react'
import { DayProvider } from '../../contexts/DayProvider'
import { Calendar } from '../../components/Calendar/assignmentsCalendar'
import { LogsStatusSidebar } from '../../components/LogFilling/LogsStatusSidebar';

const LogsStatus = () => {
  const [filter, setFilter] = useState({type: null, id: null});
  function handleFilterCahnge(id, type) {
    setFilter({
      id,
      type
    })
  }

  return (
    <DayProvider date={new Date()}>

      <section className='flex items-start '>
        <div className='w-[270px] fixed h-screen overflow-y-scroll '>
          <LogsStatusSidebar filter={filter} onFilterChange={ handleFilterCahnge} />
        </div>

        <div className='flex-1 overflow-x-auto ml-[270px]'>

          <Calendar filter={filter} />
        </div>
      </section>

    </DayProvider>
  )
}

export { LogsStatus };