/* eslint-disable react/prop-types */
import React from 'react'
import { Box, Button } from '@mui/material'
import LogTemplateSelection from './LogTemplateSelection'
import EquipmentDetails from './EquipmentDetails'
import SDEDForm from './SDEDForm'

const LogTempFilters = (props) => {
    const { logTempFilters, setLogTempFilters, setDisplayLogs } = props;
    return (
        <Box className={"w-[300px] flex p-8 justify-center flex-col  shadow-inner "}>
            <Box className={" w-full "}>
                <LogTemplateSelection
                    logTempFilters={logTempFilters}
                    setLogTempFilters={setLogTempFilters}
                />
            </Box>
            <Box>
                {logTempFilters.eq_id && (
                    <EquipmentDetails eq_id={logTempFilters.eq_id} />
                )}
            </Box>
            <Box>
                <SDEDForm
                    logTempFilters={logTempFilters}
                    setLogTempFilters={setLogTempFilters}
                />
            </Box>
            <Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    margin="normal"
                    className={"px-12"}
                    sx={{ width: "100px" }}
                    onClick={()=> {
                        setDisplayLogs(true);
                    }}
                >
                    Go!
                </Button>
            </Box>
        </Box>
    )
}

export default LogTempFilters