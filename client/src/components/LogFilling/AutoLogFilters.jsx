import React from 'react'
import { useState, useEffect } from 'react';
import EquLogAPI from '../../apis/EquLogAPI';
import { EquAPI } from '../../apis/EquAPI';
import { DatePicker } from '@mui/x-date-pickers';
import { LogTmpAPI } from '../../apis/LogTmpAPI';
import { Autocomplete, TextField } from '@mui/material';
import { LOG_TYPES } from '../../pages/LogConfig/LogConfig';
import {Button} from '@material-tailwind/react'

export const AutoLogFilters = ({ handlelAutoFill, loading}) => {
    const [error, setError] = useState(null);
    const [equList, setEquList] = useState([]);
    const [logTmpList, setLogTmpList] = useState([]);

    const [equ, setEqu] = useState(null);
    const [logTmp, setLogTmp] = useState(null);
    const [date, setDate] = useState();


    useEffect(() => {
        EquAPI.getAll().then(
            eqs => setEquList(eqs),
            err => setError(err)
        );
    }, []);

    useEffect(() => {
        if (!equ) {
            setLogTmpList([]);
            setLogTmp(null);
            return;
        }

        LogTmpAPI.getAll(equ._id).then(
            logTmpList => setLogTmpList(logTmpList),
            err => setError(err)
        );
    }, [equ]);

    async function handelSubmit(e) {
        e.preventDefault();
        await handlelAutoFill(logTmp, date);
    }

  return (
      <form className='space-y-4 ' onSubmit={handelSubmit} >

          <Autocomplete
              fullWidth
              value={equ}
              options={equList}
              getOptionLabel={op => op.name}
              isOptionEqualToValue={(op, val) => op._id === val._id}
              onChange={(e, val) => { setEqu(val);  setLogTmp(null)}}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      label='Equipment'
                  />
              )}
          />
          <Autocomplete
              fullWidth
              disabled={!equ}
              value={logTmp}
              options={logTmpList}
              
              getOptionLabel={op => LOG_TYPES[op.type]}
              isOptionEqualToValue={(op, val) => op._id === val._id}
              onChange={(e, val) => setLogTmp(val)}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      label='Type'
                  />
              )}
          />
          <DatePicker
              format="YYYY/MM"
              views={["year", "month"]}
              value={date}
              onChange={(newDate) => setDate(newDate)}
          />
          <Button type='submit' className='w-full  !mt-20' disabled={!(logTmp && date) || loading}>
              Auo Fill
          </Button>
    </form>
  )
}
