import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import EquLogAPI from '../apis/EquLogAPI';
import dayjs from 'dayjs';
import { api } from '../apis/configs/axiosConfig';

const useEquLog = (logTempFilters) => {
  const [equLogs, setEquLogs] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [fetchError, setFetchError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const { enqueueSnackbar } = useSnackbar();


  const fetchAllEquLogs = useCallback(async (params) => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const data = await EquLogAPI.fetchAll(params);
      setEquLogs(data);
      // enqueueSnackbar('EquLogs fetched successfully!', { variant: 'success' });
    } catch (err) {
      setFetchError(err.message);
      enqueueSnackbar(`Error fetching Logs: ${err.message}`, { variant: 'error' });
    } finally {
      setFetchLoading(false);
    }
  }, [EquLogAPI, enqueueSnackbar]);

  const autoFillLogs = async () => {
    try {
      setFetchLoading(true);
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
      setFetchLoading(false);
    } finally {
      setFetchLoading(false);
    }
  }

  const createEquLog = async (data) => {
    setCreateLoading(true);
    setCreateError(null);

    try {
      const newEquLog = await EquLogAPI.create(data);
      setEquLogs((prev) => [...prev, newEquLog]);
      enqueueSnackbar('Log created successfully!', { variant: 'success' });
      return newEquLog;
    } catch (err) {
      setCreateError(err.message);
      enqueueSnackbar(`Error creating log: ${err.message}`, { variant: 'error' });

    } finally {
      setCreateLoading(false);
    }
  };

  const updateEquLog = async (id, data) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const updatedEquLog = await EquLogAPI.update(id, data);
      setEquLogs((prev) =>
        prev.map((log) => (log._id === id ? updatedEquLog : log))
      );
      enqueueSnackbar('Log updated successfully!', { variant: 'success' });
    } catch (err) {
      setUpdateError(err.message);
      enqueueSnackbar(`Error updating log: ${err.message}`, { variant: 'error' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteEquLog = async (id) => {
    setDeleteLoading(true);
    setDeleteError(null);
    let error = null;
    try {
      await EquLogAPI.delete(id);
      setEquLogs((prev) => prev.filter((log) => log._id !== id));
      enqueueSnackbar('Log deleted successfully!', { variant: 'success' });
    } catch (err) {
      setDeleteError(err.message);
      enqueueSnackbar(`Error deleting log: ${err.message}`, { variant: 'error' });
      error = err;
    } finally {
      setDeleteLoading(false);
    }
    return error;
  };



  return {
    equLogs,
    fetchLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchError,
    createError,
    updateError,
    deleteError,
    fetchAllEquLogs,
    autoFillLogs,
    createEquLog,
    updateEquLog,
    deleteEquLog
  };
};

export default useEquLog;
