import React from 'react'
import StaffDashboard from './StaffDashboard'
import { DayProvider } from '../../contexts/DayProvider'

const Dashboard = () => {
  return (
    <DayProvider date={new Date()}>

      <StaffDashboard />
    </DayProvider>
  )
}

export default Dashboard