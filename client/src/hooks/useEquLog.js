import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import EquLogAPI from '../apis/EquLogAPI';
import dayjs from 'dayjs';
import { api } from '../apis/configs/axiosConfig';

const useEquLog = (logTempFilters) => {
  const [equLogs, setEquLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const { enqueueSnackbar } = useSnackbar();


  const fetchAllEquLogs = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await EquLogAPI.fetchAll(params);
      setEquLogs(data);
      // enqueueSnackbar('EquLogs fetched successfully!', { variant: 'success' });
    } catch (err) {
      setError(err.message);
      enqueueSnackbar(`Error fetching Logs: ${err.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [EquLogAPI, enqueueSnackbar]);

  const autoFillLogs = async () => {
    try {
      setLoading(true);
      const { startDate, endDate , logTemp} = logTempFilters;
      const { _id: logTempId } = logTemp;
      const response = await api.request({
        url: `/log/equipment/auto-fill/${logTempId}`,
        method: 'GET',
        params: {
          start_date: dayjs(startDate).format('YYYY-MM-DD'),
          end_date: dayjs(endDate).add(1, 'day').format('YYYY-MM-DD')
        }
      })
      const { payload: logs, success } = response.data;
      if (!success) throw new Error('Something went wring');
      await fetchAllEquLogs({
        temp_id: logTempId,
        start_date: startDate,
        end_date: endDate
      })
      if (logs?.length > 0) {
        enqueueSnackbar(`${logs.length} empty logs filled successfully`, {
          variant: 'success'
        })
      } else {
        enqueueSnackbar(`All the logs are already filld for this equipment`, {
          variant: 'info'
        })
      }
    }

    catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const createEquLog = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const newEquLog = await EquLogAPI.create(data);
      setEquLogs((prev) => [...prev, newEquLog]);
      enqueueSnackbar('Log created successfully!', { variant: 'success' });
      return newEquLog;
    } catch (err) {
      setError(err.message);
      enqueueSnackbar(`Error creating log: ${err.message}`, { variant: 'error' });

    } finally {
      setLoading(false);
    }
  };

  const updateEquLog = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEquLog = await EquLogAPI.update(id, data);
      setEquLogs((prev) =>
        prev.map((log) => (log._id === id ? updatedEquLog : log))
      );
      enqueueSnackbar('Log updated successfully!', { variant: 'success' });
    } catch (err) {
      setError(err.message);
      enqueueSnackbar(`Error updating log: ${err.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteEquLog = async (id) => {
    setLoading(true);
    setError(null);
    let error = null;
    try {
      await EquLogAPI.delete(id);
      setEquLogs((prev) => prev.filter((log) => log._id !== id));
      enqueueSnackbar('Log deleted successfully!', { variant: 'success' });
    } catch (err) {
      setError(err.message);
      enqueueSnackbar(`Error deleting log: ${err.message}`, { variant: 'error' });
      error = err;
    } finally {
      setLoading(false);
    }
    return error;
  };



  return {
    equLogs,
    loading,
    fetchAllEquLogs,
    autoFillLogs,
    createEquLog,
    updateEquLog,
    deleteEquLog
  };
};

export default useEquLog;
