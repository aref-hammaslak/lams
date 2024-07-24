import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { Autocomplete, Divider, Grid, Stack, TextField } from "@mui/material";
import { EquAPI } from "../../../apis/EquAPI.js";
import { LogTmpAPI } from "../../../apis/LogTmpAPI.js";
import { LOG_TYPES } from "../LogConfig.jsx";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ScheduleAPI } from "../../../apis/ScheduleAPI.js";

dayjs.extend(isLeapYear);

const generateDays = (date) => {
	const year = [];
	let month = [];
	for(let i=0;i<31;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<(date.isLeapYear()? 29:28);i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<31;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<30;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<31;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<30;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<31;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<31;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<30;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<31;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<30;i++) month.push([]);
	year.push(month); month = [];
	for(let i=0;i<31;i++) month.push([]);
	year.push(month);

	return year;
}

function AutoLog() {
	const [error, setError] = useState(null);
	const [equList, setEquList] = useState([]);
	const [logTmpList, setLogTmpList] = useState([]);

	const [equ, setEqu] = useState(null);
	const [logTmp, setLogTmp] = useState(null);
	const [date, setDate] = useState(dayjs().startOf('year'));

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

	// after selecting the LogTemplate. now it's time to load the miniCalandar
	const [schedules, setSchedules] = useState([]);
	useEffect(() => {
		if (!logTmp) {
			setSchedules([]);
			return;
		}

		ScheduleAPI.getAll(
			logTmp._id,
			date.startOf('year').format('YYYY-MM-DD'),
			date.endOf('year').format('YYYY-MM-DD'),
			'equipment',
			true,
			'date'
		).then(
			schs => setSchedules(schs),
			err => setError(err)
		)

	}, [logTmp]);

	const [days, setDays] = useState( generateDays(date) );


	return (
		<Stack>
			{/* header */}
			<Grid container spacing='2rem' p='1rem'>
				<Grid item xs={3}>
					<Autocomplete
						fullWidth
						value={equ}
						options={equList}
						getOptionLabel={op => op.name}
						isOptionEqualToValue={(op, val) => op._id === val._id}
						onChange={(e, val) => setEqu(val)}
						renderInput={(params) => (
							<TextField
								{...params}
								label='Equipment'
							/>
						)}
					/>
				</Grid>
				<Grid item xs={2}>
					<Autocomplete
						fullWidth
						disabled={!Boolean(equ)}
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
				</Grid>
				<Grid item xs={6} /> {/* spacer */}
				<Grid item xs={1}>
					<DatePicker
						format="YYYY"
						views={["year"]}
						value={date}
						onChange={(newDate) => setDate(newDate)}
					/>
				</Grid>
			</Grid>
			<Divider />
			{/* body */}
			<Grid container>
				<Grid item container columns={31}>
				</Grid>
			</Grid>
		</Stack>
	);
}
export default AutoLog;
