import React, { useEffect, useState } from 'react';
import { LogTmpAPI } from '../apis/LogTmpAPI';
import { reccurencs } from '../consts';
import { SliderValueLabel } from '@mui/material';
import dayjs from 'dayjs';

const useLogTemp = (logTempFilters, setLogTempFilters, navigatedFromLogsStatus ) => {
    const [scheduledLogTemps, setScheduledLogTemps] = useState(null);
    const [equipments, setEquipments] = useState([]);
    const [recurrenceTypeCodes, setRecurrenceTypeCodes] = useState([]);
    const [logSchedules, setLogSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if(navigatedFromLogsStatus)  return;
            const fetchData = async () => {
        setLoading(true);
        try {
            const data = await LogTmpAPI.getAllScheduled();
            setScheduledLogTemps(data);
            updateSetDefaults({ type: 0, data })
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
        fetchData();

    }, [navigatedFromLogsStatus]);

    const findEquipmentId = (equipmentName, data = false) => {
        if (data) {
            const equipment = data.find(({ _id }) => _id === equipmentName);
            const equipmentId = equipment?.types[0].documents[0].eq_id;
            return equipmentId;
        }
        const equipment = scheduledLogTemps.find(({ _id }) => _id === equipmentName);
        const equipmentId = equipment?.types[0].documents[0].eq_id;
        console.log(equipmentId);
        return equipmentId;
    }

    const updateSetDefaults = ({ type, value, data }) => {
        

        switch (type) {
            case 0: {
                const scheduledLogTemps = data;
                const equipments = scheduledLogTemps.map(({ _id }) => _id);
                setEquipments(equipments);

                let selectedEquipment = scheduledLogTemps.find(({ _id }) => _id === equipments[0]);

                const types = selectedEquipment.types.map(({ type }) => type);
                setRecurrenceTypeCodes(types);

                const logSchedules = scheduledLogTemps
                    .find(({ _id }) => _id === equipments[0])
                    .types.find(({ type }) => type === types[0])
                    ?.documents.map((document) => document);

                setLogSchedules(logSchedules);

                const { startDate, endDate } = getDefaultDate({
                    initial_date: logSchedules[0].schedule.initial_date,
                    end_date: logSchedules[0].schedule.end_date
                })

                setLogTempFilters({
                    ...logTempFilters,
                    equipment: equipments[0],
                    reccurence: types[0],
                    logTemp: logSchedules[0],
                    startDate,
                    endDate,
                    eq_id: findEquipmentId(equipments[0], data)
                });
                break;
            }
            case 1: {
                let selectedEquipment = scheduledLogTemps.find(({ _id }) => _id === value);

                const types = selectedEquipment.types.map(({ type }) => type);
                setRecurrenceTypeCodes(types);

                const logSchedules = scheduledLogTemps
                    .find(({ _id }) => _id === value)
                    .types.find(({ type }) => type === types[0])
                    ?.documents.map((document) => document);

                setLogSchedules(logSchedules);

                const { startDate, endDate } = getDefaultDate({
                    initial_date: logSchedules[0].schedule.initial_date,
                    end_date: logSchedules[0].schedule.end_date
                })

                setLogTempFilters({
                    ...logTempFilters,
                    equipment: value,
                    reccurence: types[0],
                    logTemp: logSchedules[0],
                    eq_id: findEquipmentId(value),
                    startDate,
                    endDate,
                });
                break;
            }
            case 2: {
                const logSchedules = scheduledLogTemps
                    .find(({ _id }) => _id === logTempFilters.equipment)
                    .types.find(({ type }) => type === value)
                    ?.documents.map((document) => document);

                setLogSchedules(logSchedules);

                const { startDate, endDate } = getDefaultDate({
                    initial_date: logSchedules[0].schedule.initial_date,
                    end_date: logSchedules[0].schedule.end_date
                })

                setLogTempFilters({
                    ...logTempFilters,

                    reccurence: value,
                    startDate,
                    endDate,
                    logTemp: logSchedules[0],
                });
                break;

            }
            case 3: {
                const { startDate, endDate } = getDefaultDate({
                    initial_date: value.initial_date,
                    end_date: value.end_date
                })
                setLogTempFilters({
                    ...logTempFilters,
                    logTemp: value,
                    startDate,
                    endDate,
                });
                break;
            }
            default:
                break;
        }
    }

    const getDefaultDate = ({ initial_date, end_date }) => {
        const initilaDate = dayjs(initial_date);
        const endSchDate = dayjs(end_date);
        const startOfMonth = dayjs().startOf('month');
        const today = dayjs();

        // the code itself is clear, no need for comment
        // const startDate = initilaDate.isBefore(startOfMonth) ? startOfMonth : initilaDate;
        // const endDate = endSchDate.isBefore(today) ? endSchDate:today;
        const startDate = dayjs().startOf('month');
        const endDate = dayjs().endOf('month');

        return { startDate, endDate };
    }

    return {
        equipments,
        recurrenceTypeCodes,
        logSchedules,
        setLogTempFilters,
        loading,
        updateSetDefaults
    };
};

export default useLogTemp;
