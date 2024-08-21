import React from 'react'
import { DayProvider } from '../../contexts/DayProvider'
import { Calendar } from '../../components/Calendar/assignmentsCalendar'
import { Typography } from '@material-tailwind/react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  List, ListItem
} from "@material-tailwind/react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const LogsAssignment = () => {
  return (
    <DayProvider date={new Date()}>

      <section className='flex items-start '>
        <div className='w-[270px] fixed h-screen overflow-y-scroll '>
          <div className='px-4 py-4 border-b shadow-md'>
            <Typography className='text-xl text-primaryDark font-bold '>

               Status
            </Typography>


          </div>
          <div className='p-4'>
            <Accordion>
              <AccordionHeader className='text-lg font-medium'>
                <span>
                  staff
                </span>
                <ArrowDropDownIcon/>
              </AccordionHeader>
              <AccordionBody>
                sidoafio
                <List>
                  <ListItem>
                    staff1
                  </ListItem>
                  <ListItem>
                    staff2
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader className='text-lg font-medium'>
                <span>
                  Equipments
                </span>
                <ArrowDropDownIcon />
              </AccordionHeader>
            </Accordion>
          </div>

        </div>

        <div className='flex-1 overflow-x-auto ml-[270px]'>

          <Calendar />
        </div>
      </section>

    </DayProvider>
  )
}

export { LogsAssignment };