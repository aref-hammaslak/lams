import React, { useEffect, useState } from 'react';
import { LogTmpAPI } from '../apis/LogTmpAPI';
import { reccurencs } from '../consts';

const useLogTemp = (logTempFilters, setLogTempFilters) => {
    const [scheduledLogTemps, setScheduledLogTemps] = useState(null);
    const [equipments, setEquipments] = useState([]);
    const [recurrenceTypeCodes, setRecurrenceTypeCodes] = useState([]);
    const [logSchedules, setLogSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await LogTmpAPI.getAllScheduled();
                setScheduledLogTemps(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const deserializeLogTemps = () => {
            if (!scheduledLogTemps) return;

            const equipmentIds = scheduledLogTemps.map(({ _id }) => _id);
            setEquipments(equipmentIds);

            if (!logTempFilters.equipment) return;

            const selectedEquipment = scheduledLogTemps.find(({ _id }) => _id === logTempFilters.equipment);
            if (!selectedEquipment) return;

            const types = selectedEquipment.types.map(({ type }) => type);
            setRecurrenceTypeCodes(types);

            if (!logTempFilters.reccurence && logTempFilters.reccurence !== 0) return;

            const logSchedules = scheduledLogTemps
				.find(({ _id }) => _id === logTempFilters.equipment)
				.types.find(({ type }) => type === logTempFilters.reccurence)
				?.documents.map((document) => document);
			
            setLogSchedules(logSchedules);


        };

        deserializeLogTemps();
    }, [logTempFilters, scheduledLogTemps]);

    const setDefaultFilters = () => {
        if (!logTempFilters.equipment && equipments.length > 0) {
            setLogTempFilters(prev => ({
                ...prev,
                equipment: equipments[0],
                recurrence: undefined,
            }));
        }

        if (logTempFilters.equipment && !logTempFilters.recurrence && recurrenceTypeCodes.length > 0) {
            setLogTempFilters(prev => ({
                ...prev,
                recurrence: recurrenceTypeCodes[0],
                schedule: undefined,
            }));
        }

        if (logTempFilters.equipment && logTempFilters.recurrence && !logTempFilters.schedule && logSchedules.length > 0) {
            setLogTempFilters(prev => ({
                ...prev,
                schedule: logSchedules[0],
            }));
        }
    };

    const findEquipmentId = (equipmentName) => {
        const equipment = scheduledLogTemps.find(({ _id }) => _id === equipmentName);
        const equipmentId = equipment?.types[0].documents[0].eq_id;
        console.log(equipmentId);
        return equipmentId;
    };

    return {
        equipments,
        recurrenceTypeCodes,
        logSchedules,
        setLogTempFilters,
        setEquipments,
        setRecurrenceTypeCodes,
        loading,
        setDefaultFilters,
        findEquipmentId,
    };
};

export default useLogTemp;
