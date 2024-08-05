/* eslint-disable react/prop-types */


// extracts all the equipment names from the log templates

import React, { useState } from "react";
import { MenuItem, FormControl, Select, InputLabel, Box } from "@mui/material";
import { useEffect } from "react";
import { LogTmpAPI } from "../../apis/LogTmpAPI";
import PropTypes from "prop-types";
import useLogTemp from "../../hooks/useLogTemp";
import { reccurencs } from "../../consts";



function LogTemplateSelection({ logTempFilters, setLogTempFilters }) {
	const { equipments, logSchedules, setLogSchedules, recurrenceTypeCodes, setRecurrenceTypeCodes, findEquipmentId, loading } = useLogTemp(logTempFilters, setLogTempFilters);

	return (
		<Box className={"flex gap-4 sm:justify-between font-[Roboto] justify-center flex-wrap "}>
			{loading && <div>Loading...</div>}
			<FormControl className={"w-[220px] bg-white "}>
				<InputLabel id="">Choose Equipment</InputLabel>

				<Select

					value={logTempFilters.equipment}

					label="Choose an option"
					onChange={(e) => {
						setLogTempFilters({
							...logTempFilters,
							equipment: e.target.value,
							eq_id: findEquipmentId(e.target.value),
						});
						setRecurrenceTypeCodes([]);
						setLogSchedules([]);
					}}
				>
					{equipments.map((eq, index) => (
						<MenuItem key={index} value={eq}>
							{eq}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl className={"w-[220px] bg-white "}>
				<InputLabel >Choose Reccurenc</InputLabel>
				<Select
					value={logTempFilters.reccurence}
					label="Choose an option"
					onChange={(e) => {
						setLogTempFilters({
							...logTempFilters,
							reccurence: e.target.value,
							// logTemp: null,
						});
						setLogSchedules([]);
					}}
				>
					{recurrenceTypeCodes?.map((reccTypeCode, index) => (
						<MenuItem key={index} value={reccTypeCode}>
							{reccurencs[reccTypeCode]}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl className={"w-[220px] bg-white "}>
				<InputLabel id="">Choose Schedule</InputLabel>
				<Select
					label="Choose an option"
					value={logTempFilters.logTemp}
					onChange={(e) =>
						setLogTempFilters({
							...logTempFilters,
							logTemp: e.target.value,
						})
					}
				>
					{logSchedules?.map((logSchedule, index) => (
						<MenuItem key={index} value={logSchedule}>
							{logSchedule.schedule.initial_date.split("T")[0]}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

LogTemplateSelection.proptypes = {
	logTempFilters: {
		equipment: PropTypes.string,
		reccurence: PropTypes.number,
		logTemp: PropTypes.object,
	},
	setLogTempFilters: PropTypes.func,
};

export default LogTemplateSelection;
