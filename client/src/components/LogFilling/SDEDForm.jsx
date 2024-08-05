/* eslint-disable react/prop-types */
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Schedule } from "@mui/icons-material";


function CustomDatePicker(props) {
	const { value, onChange, ...other } = props;
	return (
		<DatePicker
			{...other}
			value={value}

			onChange={onChange}
	
			className="text-blue-300"
			slotProps={{
				textField: {
					variant: "outlined",
					style: { background: "#fff", color: "blue" },
					className: "bg-light text-blue",
				},
			}}
		/>
	);
}

function SDEDForm({logTempFilters , setLogTempFilters}) {


	
	const schedule = logTempFilters?.logTemp?.schedule;
	const scheduleInitialDate = schedule?.initial_date;
	const scheduleEndDate = schedule?.end_date;
	console.log(scheduleInitialDate, scheduleEndDate)
	

	return (
		
		<div >
			<div  className={"flex items-center sm:justify-between gap-4 mt-4 flex-col justify-end "}>
				<div className="flex flex-col items-center gap-2 ">
					<CustomDatePicker
						defaultValue={dayjs(scheduleInitialDate)}
						minDate={dayjs(scheduleInitialDate)}
						disabled={!schedule}
						label="Start"
						disableFuture
						value={logTempFilters.startDate}
						onChange={(newValue) =>
							setLogTempFilters({ ...logTempFilters, startDate: newValue })
						}
						renderInput={(params) => (
							<TextField
								{...params}
								required
								fullWidth
								margin="normal"
							/>
						)}
					/>
                    
                    <div className="w-4 h-[2px] bg-blue-300 rounded rotate-90  my-2 "></div>
					<CustomDatePicker
						label="End"
						defaultValue={dayjs(scheduleEndDate)}
						maxDate={dayjs(scheduleEndDate)}
						value={logTempFilters.endDate}
						disabled={!schedule}

						onChange={(newValue) =>
							setLogTempFilters({ ...logTempFilters, endDate: newValue })
						}
						renderInput={(params) => (
							<TextField
								{...params}
								required
								fullWidth
								margin="normal"
							/>
						)}
						minDate={logTempFilters.startDate}
					/>
				</div>
				
			</div>
		</div>
	);
}

export default SDEDForm;
