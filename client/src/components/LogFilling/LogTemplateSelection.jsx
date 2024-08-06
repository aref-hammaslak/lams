/* eslint-disable react/prop-types */


// extracts all the equipment names from the log templates

import React, { useContext, useState } from "react";
import { MenuItem, FormControl, Select, InputLabel, Box } from "@mui/material";
import PropTypes from "prop-types";
import { reccurencs } from "../../consts";
import { logFillingContext } from "../../contexts/LogFillingProvider";


function LogTemplateSelection() {
	const { logTempFilters, equipments, logSchedules, recurrenceTypeCodes, updateSetDefaults, loading } = useContext(logFillingContext);

	return (
		<>

			(<Box className={"flex gap-4 sm:justify-between font-[Roboto] justify-center flex-wrap "}>

				<FormControl className={"w-[220px] bg-white "}>
					<InputLabel id="">Choose Equipment</InputLabel>

					<Select

						value={logTempFilters.equipment}

						label="Choose an option"
						onChange={(e) => {
							const equipment = e.target.value;

							updateSetDefaults({ type: 1, value: equipment });
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
							updateSetDefaults({ type: 2, value: e.target.value });
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
					<InputLabel >Choose Schedule</InputLabel>
					<Select
						label="Choose an option"
						value={JSON.stringify(logTempFilters.logTemp)}
						onChange={(e) => {

							updateSetDefaults({ type: 3, value: JSON.parse(e.target.value) });
						}}
					>
						{logSchedules?.map((logSchedule, index) => (
							<MenuItem key={index} value={JSON.stringify(logSchedule)}>
								{logSchedule.schedule.initial_date.split("T")[0]}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>)

		</>

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
