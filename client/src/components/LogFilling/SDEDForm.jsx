/* eslint-disable react/prop-types */
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";


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

function SDEDForm({dateRange, setDateRange,}) {

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Form Data:", dateRange);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div  className={"flex items-center sm:justify-between gap-4 mt-4 flex-col justify-end "}>
				<div className="flex flex-col items-center gap-2 ">
					<CustomDatePicker
						label="Start"
						value={dateRange.startDate}
						onChange={(newValue) =>
							setDateRange({ ...dateRange, startDate: newValue })
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
						value={dateRange.endDate}
						disabled={!dateRange.startDate}
						disableFuture
						onChange={(newValue) =>
							setDateRange({ ...dateRange, endDate: newValue })
						}
						renderInput={(params) => (
							<TextField
								{...params}
								required
								fullWidth
								margin="normal"
							/>
						)}
						minDate={dateRange.startDate}
					/>
				</div>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					margin="normal"
                    className={"px-12"}
                    sx={{width: "100px"}}
				>
					Go!
				</Button>
			</div>
		</form>
	);
}

export default SDEDForm;
