import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import EquLogAPI from '../apis/EquLogAPI';

const useEquLog = () => {
  const api = EquLogAPI;
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

  const fetchAllEquLogs = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const data = await api.fetchAll();
      setEquLogs(data);
      enqueueSnackbar('EquLogs fetched successfully!', { variant: 'success' });
    } catch (err) {
      setFetchError(err.message);
      enqueueSnackbar(`Error fetching equLogs: ${err.message}`, { variant: 'error' });
    } finally {
      setFetchLoading(false);
    }
  }, [api, enqueueSnackbar]);

  const createEquLog = async (data) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const newEquLog = await api.create(data);
      setEquLogs((prev) => [...prev, newEquLog]);
      enqueueSnackbar('EquLog created successfully!', { variant: 'success' });
    } catch (err) {
      setCreateError(err.message);
      enqueueSnackbar(`Error creating entity: ${err.message}`, { variant: 'error' });
    } finally {
      setCreateLoading(false);
    }
  };

  const updateEquLog = async (id, data) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const updatedEquLog = await api.update(id, data);
      setEquLogs((prev) =>
        prev.map((entity) => (entity.id === id ? updatedEquLog : entity))
      );
      enqueueSnackbar('EquLog updated successfully!', { variant: 'success' });
    } catch (err) {
      setUpdateError(err.message);
      enqueueSnackbar(`Error updating entity: ${err.message}`, { variant: 'error' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteEquLog = async (id) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(id);
      setEquLogs((prev) => prev.filter((entity) => entity.id !== id));
      enqueueSnackbar('EquLog deleted successfully!', { variant: 'success' });
    } catch (err) {
      setDeleteError(err.message);
      enqueueSnackbar(`Error deleting entity: ${err.message}`, { variant: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEquLogs();
  }, [fetchAllEquLogs]);

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
    createEquLog,
    updateEquLog,
    deleteEquLog
  };
};

export default useEquLog;
