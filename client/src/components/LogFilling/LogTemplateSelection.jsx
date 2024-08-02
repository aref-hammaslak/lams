/* eslint-disable react/prop-types */


// extracts all the equipment names from the log templates

import React, { useState } from "react";
import { MenuItem, FormControl, Select, InputLabel, Box } from "@mui/material";
import { useEffect } from "react";
import { LogTmpAPI } from "../../apis/LogTmpAPI";
import PropTypes from "prop-types";

const reccurencs = [
	"daily",
	"monthly",
	"quarterly",
	"semi-annually",
	"annually",
];

function LogTemplateSelection({ selectedLogTemp, setSelcectedLogTemp }) {
	const [scheduledLogTems, setScheduledLogTemps] = useState(null);
	const [equipments, setEquipments] = useState([]);
	const [reccTypeCodes, setReccTypeCodes] = useState([]);
	const [logSchedules, setLogSchedules] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				setScheduledLogTemps(await LogTmpAPI.getAllScheduled());
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, []);
	
	useEffect(() => {
		function deserializeLogTemps() {
			if (!scheduledLogTems) return;
			const equipments = scheduledLogTems.map(({ _id }) => _id);
			setEquipments(equipments);

			if (!selectedLogTemp.equipment) return;

			// lists all the reccurenc types specified for an equipment
			const reccTypeCodes = scheduledLogTems
				.find(({ _id }) => _id === selectedLogTemp.equipment)
				.types.map(({ type }) => type);

			setReccTypeCodes(reccTypeCodes);

			if (!selectedLogTemp.reccurence) return;

			//all the scheduled logs for ech "equipment" , "reccurence" pairs

			const logSchedules = scheduledLogTems
				.find(({ _id }) => _id === selectedLogTemp.equipment)
				.types.find(({ type }) => type === selectedLogTemp.reccurence)
				?.documents.map((document) => document);
			console.log(logSchedules);
			setLogSchedules(logSchedules);
		}
		deserializeLogTemps();
	}, [
		selectedLogTemp,
		scheduledLogTems
	]);

	function findEqId(eqName) {
		const id = scheduledLogTems.find(({ _id }) => _id === eqName)?.types[0]
			.documents[0].eq_id;
		console.log(id);
		return id;
	}

	return (
		<Box className={"flex gap-4 sm:justify-between font-[Roboto] justify-center flex-wrap "}>
			<FormControl className={"w-[220px] bg-white "}>
				<InputLabel id="">Choose Equipment</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id=""
					value={selectedLogTemp.equipment}
					label="Choose an option"
					onChange={(e) => {
						setSelcectedLogTemp({
							...selectedLogTemp,
							equipment: e.target.value,
							eq_id: findEqId(e.target.value),
							reccurence: null,
							logTemp: null,
						});
						setReccTypeCodes([]);
						setLogSchedules([]);
					}}
				>
					{equipments.map((eq) => (
						<MenuItem key={eq} value={eq}>
							{eq}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl className={"w-[220px] bg-white "}>
				<InputLabel id="">Choose Reccurenc</InputLabel>
				<Select
					labelId=""
					value={selectedLogTemp.reccurence}
					id="demo-simple-select"
					label="Choose an option"
					onChange={(e) => {
						setSelcectedLogTemp({
							...selectedLogTemp,
							reccurence: e.target.value,
							logTemp: null,
						});
						setLogSchedules([]);
					}}
				>
					{reccTypeCodes?.map((reccTypeCode) => (
						<MenuItem key={reccTypeCode} value={reccTypeCode}>
							{reccurencs[reccTypeCode]}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl className={"w-[220px] bg-white "}>
				<InputLabel id="">Choose Schedule</InputLabel>
				<Select
					labelId=""
					id="demo-simple-select"
					label="Choose an option"
					value={selectedLogTemp.logTemp}
					onChange={(e) =>
						setSelcectedLogTemp({
							...selectedLogTemp,
							logTemp: e.target.value,
						})
					}
				>
					{logSchedules?.map((logSchedule, index) => (
						<MenuItem key={logSchedule} value={logSchedule}>
							{logSchedule.schedule.initial_date.split("T")[0]}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

LogTemplateSelection.proptypes = {
	selectedLogTemp: {
		equipment: PropTypes.string,
		reccurence: PropTypes.number,
		logTemp: PropTypes.object,
	},
	setSelcectedLogTemp: PropTypes.func,
};

export default LogTemplateSelection;
