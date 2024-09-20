import React, { useEffect, useState } from 'react';
import { LogTmpAPI } from '../apis/LogTmpAPI';
import dayjs from 'dayjs';

const useLogTemp = (logTempFilters, setLogTempFilters, navigatedFromLogsStatus ) => {
    const [scheduledLogTemps, setScheduledLogTemps] = useState(null);
    const [equipments, setEquipments] = useState([]);
    const [recurrenceTypeCodes, setRecurrenceTypeCodes] = useState([]);
    const [logSchedules, setLogSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
        setLoading(true);
        try {
            const data = await LogTmpAPI.getAllScheduled();
            setScheduledLogTemps(data);
            updateSetDefaults({ type: 0, data })
        } catch (error) {
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
        fetchData();

    }, []);

    const findEquipmentId = (equipmentName, data = false) => {
        if (data) {
            const equipment = data.find(({ _id }) => _id === equipmentName);
            const equipmentId = equipment?.types[0].documents[0].eq_id;
            return equipmentId;
        }
        const equipment = scheduledLogTemps.find(({ _id }) => _id === equipmentName);
        const equipmentId = equipment?.types[0].documents[0].eq_id;
        return equipmentId;
    }

    const updateSetDefaults = ({ type, value, data }) => {
        switch (type) {
            case 0: {
                const scheduledLogTemps = data;
                const equipments = scheduledLogTemps.map(({ _id }) => _id).sort();
                setEquipments(equipments);

                let selectedEquipment = scheduledLogTemps.find(({ _id }) => _id === equipments[0]);

                const types = selectedEquipment.types.map(({ type }) => type).sort((a,b)=> a-b);
                setRecurrenceTypeCodes(types);

                const logSchedules = scheduledLogTemps
                    .find(({ _id }) => _id === equipments[0])
                    .types.find(({ type }) => type === types[0])
                    ?.documents.map((document) => document);

                setLogSchedules(logSchedules);

                const { startDate, endDate } = getDefaultDate();

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

                const types = selectedEquipment.types.map(({ type }) => type).sort((a, b) => a - b);
                setRecurrenceTypeCodes(types);

                const logSchedules = scheduledLogTemps
                    .find(({ _id }) => _id === value)
                    .types.find(({ type }) => type === types[0])
                    ?.documents.map((document) => document);

                setLogSchedules(logSchedules);

                setLogTempFilters({
                    ...logTempFilters,
                    equipment: value,
                    reccurence: types[0],
                    logTemp: logSchedules[0],
                    eq_id: findEquipmentId(value),
                });
                break;
            }
            case 2: {
                const logSchedules = scheduledLogTemps
                    .find(({ _id }) => _id === logTempFilters.equipment)
                    .types.find(({ type }) => type === value)
                    ?.documents.map((document) => document);

                setLogSchedules(logSchedules);

                setLogTempFilters({
                    ...logTempFilters,
                    reccurence: value,
                    logTemp: logSchedules[0],
                });
                break;

            }
            default:
                break;
        }
    }

    const getDefaultDate = () => {
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
