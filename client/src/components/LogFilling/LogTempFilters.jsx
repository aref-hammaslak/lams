/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { Box, Button } from '@mui/material'
import LogTemplateSelection from './LogTemplateSelection'
import EquipmentDetails from './EquipmentDetails'
import SDEDForm from './SDEDForm'
import useLogTemp from '../../hooks/useLogTemp'
import { logFillingContext } from '../../contexts/LogFillingProvider'

const LogTempFilters = () => {
    const { logTempFilters, setLogTempFilters, setDisplayLogs } = useContext(logFillingContext);

    return (
        <Box className={"w-full flex   justify-center flex-col "}>
            <Box >
                <LogTemplateSelection
                   
                />
            </Box>
            <Box>
                <SDEDForm
                />
            </Box>
            {/* <Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    margin="normal"
                    className={"mt-4"}
                    sx={{ width: "100px", mt:2}}
                    onClick={()=> {
                        setDisplayLogs(true);
                    }}
                >
                    Go!
                </Button>
            </Box> */}
            {/* <Box>
                {logTempFilters?.eq_id && (
                    <EquipmentDetails eq_id={logTempFilters.eq_id} />
                )}
            </Box> */}
        </Box>
    )
}

export  {LogTempFilters}