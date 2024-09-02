import {
	Box,
	Chip,
	Grid,
	Paper,
	Stack,
	Typography,
	CircularProgress,
	Divider,
	Link,
	Autocomplete,
	TextField,
	Breadcrumbs,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight.js";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeviceThermostatRoundedIcon from "@mui/icons-material/DeviceThermostatRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import useSchedule from "../../hooks/useSchedule.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { ShMenu } from "../../components/Scheduler/ShMenu.jsx";
import { ScheduleAPI } from "../../apis/ScheduleAPI.js";
import MenuItem from "@mui/material/MenuItem";
import { DayDialog } from "../../components/Scheduler/DayDialog.jsx";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useAuth from "../../hooks/useAuth.js";
import { LabAPI } from "../../apis/LabAPI.js";

const REC_COLOR = {
	daily: "primary",
	weekly: "primary",
	monthly: "warning",
	quarterly: "secondary",
	semiannually: "secondary",
	annually: "secondary",
};

const TYPE_ICON = {
	thermometer: <DeviceThermostatRoundedIcon />,
	surface: <TableRestaurantRoundedIcon />,
	equipment: <BiotechRoundedIcon />,
};

export const ScheduleAssign = () => {
	const navigate = useNavigate();
	const { auth, setAuth } = useAuth();
	const today = dayjs().startOf("day");
	const { error, setError } = useState(null);
	const {
		date,
		days,
		items,
		daysArray,
		prevMonth,
		nextMonth,
		refresh,
		startEdit,
		endEdit,
		item,
		selectedDay,
		selectDay,
		selectSchedule,
		selectedSchedule,
		changeScheduleType,
		expandedDay,
		expandDay,
		changeDate,
		selectedTasks,
		toggleTask,
	} = useSchedule();

	const [anchorEl, setAnchorEl] = useState(null);
	const [schAnchor, setSchAnchor] = useState(null);

	const [schType, setSchType] = useState("All");

	useEffect(() => {
		changeScheduleType(schType.toLowerCase());
	}, [schType]);

	// const handleSubmit = (data) => {
	// 	if (item) {
	// 		console.log(data);
	// 		ScheduleAPI.update(item._id, {
	// 			initial_date: data.initial_date.format("YYYY-MM-DD"),
	// 			recurrence: data.recurrence === "none" ? null : data.recurrence,
	// 			end_date: data.end_date
	// 				? data.end_date.add(1, "day").format("YYYY-MM-DD")
	// 				: null,
	// 		}).then(
	// 			(_) => {
	// 				refresh();
	// 				endEdit();
	// 				selectDay(null);
	// 				selectSchedule(null);
	// 			},
	// 			(err) => setError(err)
	// 		);
	// 	} else {
	// 		ScheduleAPI.create(
	// 			data.type,
	// 			data.item._id,
	// 			data.initial_date.format("YYYY-MM-DD"),
	// 			data.end_date
	// 				? data.end_date.add(1, "day").format("YYYY-MM-DD")
	// 				: undefined,
	// 			data.recurrence === "none" ? undefined : data.recurrence
	// 		).then(
	// 			(_) => {
	// 				refresh();
	// 				selectDay(null);
	// 			},
	// 			(err) => setError(error)
	// 		);
	// 	}
	// };

	const [delConf, setDelConf] = useState(false);
	const handleDeleteSchedule = () => {
		if (!delConf) {
			setDelConf(true);
			return;
		}

		ScheduleAPI.destroy(selectedSchedule._id).then(
			(_) => {
				refresh();
				setDelConf(false);
				selectSchedule(null);
			},
			(err) => setError(err)
		);
	};

	return (
		<>

			<Grid

				direction="column"
				padding="1rem"
				alignItems="center"
				justifyContent="center"
				marginTop="2rem"
				className="container mx-auto py-14"
			>
				<Grid item alignSelf="stretch" mb="2rem">
					<Stack direction="row" spacing="2rem">
						<IconButton size="large" onClick={prevMonth} color="primary">
							<ChevronLeftIcon />
						</IconButton>
						<DatePicker
							format="YYYY-MM"
							views={["year", "month"]}
							value={date}
							onChange={(newDate) => changeDate(newDate)}
						/>
						<IconButton size="large" onClick={nextMonth} color="primary">
							<ChevronRightIcon />
						</IconButton>
						<Autocomplete
							disableClearable
							value={schType}
							sx={{ width: "10rem" }}
							onChange={(_, val) => setSchType(val)}
							options={[
								"All",
								// "User",
								"Equipment",
								"Surface",
								"Thermometer",
							]}
							renderInput={(params) => (
								<TextField {...params} label="Schedule Type" />
							)}
						/>
						<Typography
							variant="h4"
							marginLeft="auto !important"
							color="primary"
							fontWeight="800"
						>
							{date.format("MMMM YYYY")}
						</Typography>
					</Stack>
				</Grid>
				<Grid
					item
					container
					columns={7}
					component={Paper}
					bgcolor="lightgray"
				>
					<Grid item xs={1}>
						<Typography fontWeight="bold">Sunday</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography fontWeight="bold">Monday</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography fontWeight="bold">Tuesday</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography fontWeight="bold">Wednesday</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography fontWeight="bold">Thursday</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography fontWeight="bold">Friday</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography fontWeight="bold">Saturday</Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					columns={7}
					flexGrow={1}
					component={Paper}
					bgcolor="lightgray"
				>
					{daysArray()
						.map((key) => ({ key, day: days[key] }))
						.map(({ key, day }) => (
							<Grid
								item
								key={key}
								xs={1}
								sx={{
									paddingTop: ".1rem",
									paddingRight: ".1rem",
								}}
								className={day.mute ? null : "ccell"}
								style={{
									filter: day.mute ? "brightness(70%)" : null,
								}}
							>
								<Stack
									direction="column"
									component={Paper}
									height="100%"
								>
									<Stack
										direction="row"
										justifyContent="space-between"
									>
										{today.format("YYYY-MM-DD") !== key ? (
											<Typography ml="5px">
												{day.date.date()}
											</Typography>
										) : (
											<Box>
												<Chip
													// sx={{ marginLeft: '2px' }}
													size="small"
													variant="filled"
													color="success"
													label={day.date.date()}
												/>
											</Box>
										)}
										{/* <AddCircleOutlineRoundedIcon
											color="primary"
											sx={{
												display: "none",
												".ccell:hover &": {
													display: "block",
													cursor: "pointer",
												},
											}}
											onClick={(e) => {
												e.stopPropagation();
												setAnchorEl(e.currentTarget.parentElement);
												selectDay(key);
											}}
										/> */}
									</Stack>
									<Divider />
									<Box
										height="5.5rem"
										sx={{
											overflowY: "auto",
										}}
										className='scrollbar-thin'
										onClick={() => {
											// if (day.date.isBefore(today)) return;
											expandDay(day);
										}}
									>
										{day.loading ? (
											<CircularProgress />
										) : (
											day.schedules.map((sch) => (
												<>
													{
														sch.type === 'user' ? null :
															<Chip
																avatar={
																	sch.type === "user" ? (
																		<Avatar />
																	) : null
																}
																key={sch._id}
																variant={
																	sch.type === "user"
																		? "outlined"
																		: "filled"
																}
																deleteIcon={TYPE_ICON[sch.type]}
																onDelete={
																	sch.type !== "user" ? () => { } : null
																}
																label={(() => {
																	let name = "";
																	name +=
																		items[sch.type]?.[sch.id]?.name ||
																		"DELETED";
																	switch (sch.recurrence) {
																		case "quarterly":
																			name += " [Q]";
																			break;
																		case "semiannual":
																			name += " [S]";
																			break;
																		case "annually":
																			name += " [A]";
																			break;
																	}
																	return name;
																})()}
																color={
																	items[sch.type]?.[sch.id]
																		? REC_COLOR[sch.recurrence]
																		: "error"
																}
																size="small"
																onContextMenu={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	setSchAnchor(e.target);
																	selectSchedule(sch);
																}}
																onClick={(e) => {
																	if (e.type === "click") return;
																	e.stopPropagation();
																	setSchAnchor(e.target);
																	selectSchedule(sch);
																}}
																sx={{ margin: "2px" }}
															/>
													}

												</>

											))
										)}
									</Box>
								</Stack>
							</Grid>
						))}
				</Grid>
			</Grid>
			<Menu
				open={Boolean(selectedSchedule)}
				anchorEl={schAnchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				onClose={() => {
					selectSchedule(null);
					setDelConf(false);
				}}
			>
				{/* <MenuItem
					onClick={() => {
						startEdit(selectedSchedule).then(
							(_) => { },
							(err) => setError(err)
						);
						setAnchorEl(schAnchor);
					}}
				>
					<Typography color="primary">Edit</Typography>
				</MenuItem> */}
				<MenuItem onClick={handleDeleteSchedule}>
					{delConf ? (
						<Typography color="warning.main">Sure?</Typography>
					) : (
						<Typography color="error">Delete</Typography>
					)}
				</MenuItem>
			</Menu>
			{/* <Menu
				open={Boolean(selectedDay)}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "center",
					horizontal: "center",
				}}
				onClose={() => {
					selectDay(null);
					endEdit();
				}}
			>
				<Stack direction="column">
					<Grid container justifyContent="space-between" padding="0.5rem">
						<Grid item>
							<Typography fontWeight="bolder">
								{item ? "Edit Schedule" : "New Schedule"}
							</Typography>
						</Grid>
						<Grid item>
							<CloseIcon
								onClick={() => selectDay(null)}
								sx={{
									"&:hover": { cursor: "pointer", color: "black" },
									color: "gray",
								}}
							/>
						</Grid>
					</Grid>
					<Divider />
					<ShMenu
						onClose={() => selectDay(null)}
						item={item}
						date={days[selectedDay]?.date}
						onSubmit={handleSubmit}
					/>
				</Stack>
			</Menu> */}
			<DayDialog
				open={Boolean(expandedDay)}
				day={expandedDay}
				info={items}
				onClose={() => expandDay(null)}
			/>
		</>
	);
}

