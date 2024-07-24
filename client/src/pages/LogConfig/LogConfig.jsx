import {
	Button,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Autocomplete,
	TextField,
	Breadcrumbs,
	Link,
	Box,
	Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EditIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { LogTmpAPI } from "../../apis/LogTmpAPI";
import { EquAPI } from "../../apis/EquAPI.js";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import * as React from "react";
import Scheduler from "../Scheduler";
import useAuth from "../../hooks/useAuth.js";
import { LabAPI } from "../../apis/LabAPI.js";

export const LOG_TYPES = [
	"Daily",
	"Monthly",
	"Quarterly",
	"SemiAnnually",
	"Annually",
];

export const ITEM_TYPES = [
	"CheckBox",
	"Text",
	"Number",
	"Options(C/R/F)",
	"Options(C/R/CR)",
	"Options(C/F)",
];

export function dialogReducer(state, action) {
	switch (action.type) {
		case "create":
			return {
				mode: "create",
				open: true,
				equipment: null,
				type: null,
				itemLabel: "",
				itemType: null,
				items: [],
				errors: {},
			};
		case "edit":
			console.log({
				action,
			});
			return {
				mode: "edit",
				open: true,
				id: action.data._id,
				equipment: action.data.equipment,
				type: action.data.type,
				itemLabel: "",
				itemType: null,
				items: action.data.items,
				errors: {},
			};
		case "close":
			return {
				...state,
				open: false,
			};
		case "eq":
			return {
				...state,
				equipment: action.equipment,
			};
		case "type":
			return {
				...state,
				type: action.logType,
			};
		case "itemLabel":
			return {
				...state,
				itemLabel: action.itemLabel,
			};
		case "itemType":
			return {
				...state,
				itemType: action.itemType,
			};
		case "error":
			return {
				...state,
				errors: action.errors,
			};
		case "items":
			return {
				...state,
				items: action.items,
			};
		case "add":
			const { itemType, itemLabel, ...newState } = state;
			return {
				...newState,
				items: [action.item, ...newState.items],
			};
		case "remove":
			const { label, type } = action.item;
			return {
				...state,
				items: state.items.filter(
					(i) => !(i.label === label && i.type === type)
				),
			};
	}
}

function LogConfig() {
	const navigate = useNavigate();
	const [labs, setLabs] = useState([]);
	const [currentLab, setCurrentLab] = useState(null);
	const { auth, setAuth } = useAuth();

	useEffect(() => {
		LabAPI.getAll().then((labs) => {
			setLabs(labs);
			const lab = labs.find((lab) => lab._id === auth.lab_id);
			setCurrentLab(lab);
		});
	}, []);

	const [error, setError] = useState(null);
	const [logConfs, setLogConfs] = useState([]);
	const [equipments, setEquipments] = useState([]);

	// lc : LogConfig
	const [dialogState, dispatch] = useReducer(dialogReducer, {
		open: false,
		errors: {},
	});
	const handleEditDialog = (logConfig) => {
		dispatch({ type: "edit", data: logConfs });
	};
	const handleCloseDialog = () => dispatch({ type: "close" });
	const handleOpenDialog = () => dispatch({ type: "create" });
	const handleChangeEquipment = (eq) => {
		if (!eq) return dispatch({ type: "eq", equipment: eq });
		const found = logConfs.find(
			(lc) => lc.eq_id === eq._id && lc.type === dialogState.type
		);
		if (found) {
			dispatch({
				type: "error",
				errors: {
					equipment: { message: "This Log Configuration already exists" },
					type: {},
				},
			});
		} else {
			dispatch({ type: "error", errors: {} });
		}
		dispatch({ type: "eq", equipment: eq });
	};
	const handleChangeType = (logType) => {
		if (logType === null) return dispatch({ type: "type", logType });
		console.log({
			logType,
			equipment: dialogState.equipment,
			logConfs,
		});
		const found =
			dialogState.equipment &&
			logConfs.find(
				(lc) =>
					lc.eq_id === dialogState.equipment._id && lc.type === logType
			);
		if (found) {
			dispatch({
				type: "error",
				errors: {
					equipment: { message: "This Log Configuration already exists" },
					type: {},
				},
			});
		} else {
			dispatch({ type: "error", errors: {} });
		}
		dispatch({ type: "type", logType });
	};
	const handleAddItem = () => {
		const { itemLabel, itemType } = dialogState;
		if (!itemLabel || itemType === null) return;

		if (
			dialogState.items.find(
				(i) => i.label === itemLabel && i.type === itemType
			)
		)
			return;

		itemLabelInput.current.value = "";
		console.log(itemLabelInput.current);
		dispatch({ type: "add", item: { label: itemLabel, type: itemType } });
	};
	const handleDeleteItem = (item) => {
		const { label, type } = item;
		dispatch({ type: "remove", item: { label, type } });
	};

	const handleSubmit = () => {
		if (dialogState.mode === "edit") {
			const { id, items } = dialogState;
			console.log({ items });
			return LogTmpAPI.update(id, { items }).then(
				(logConf) => {
					dispatch({ type: "items", items: logConf.items });
					const { lab_id, name } = equipments.find(
						(eq) => eq._id === logConf.eq_id
					);
					setLogConfs(
						logConfs.map((lc) => {
							if (lc._id === logConf._id) {
								return { ...logConf, eq_details: [{ lab_id, name }] };
							} else {
								return lc;
							}
						})
					);
					dispatch({ type: "close" });
				},
				(err) => setError(err)
			);
		}

		const { equipment, type, items } = dialogState;
		if (!equipment || type === null) {
			const errors = {
				...dialogState.errors,
			};
			if (!equipment) errors.equipment = { message: "required" };
			if (type === null) errors.type = { message: "required" };

			return dispatch({ type: "error", errors });
		}
		LogTmpAPI.create({ eq_id: equipment._id, type, items }).then(
			(logConfig) => {
				const { lab_id, name } = equipments.find(
					(eq) => eq._id === logConfig.eq_id
				);
				setLogConfs([
					{ ...logConfig, eq_details: [{ lab_id, name }] },
					...logConfs,
				]);
				handleCloseDialog();
			},
			(err) => setError(err)
		);
	};

	const handleDelete = () => {
		console.log({
			dialogState,
		});
		LogTmpAPI.destroy(dialogState.id).then(
			(logConfig) => {
				setLogConfs(logConfs.filter((lc) => lc._id !== logConfig._id));
				handleCloseDialog();
			},
			(err) => setError(err)
		);
	};

	useEffect(() => {
		EquAPI.getAll().then(
			(equs) => {
				setEquipments(equs);
				LogTmpAPI.getAll().then(
					(logConfs) => setLogConfs(logConfs),
					(error) => setError(error)
				);
			},
			(error) => setError(error)
		);
	}, []);

	const columns = useMemo(
		() => [
			{
				field: "_id",
				headerName: "ID",
				flex: 0,
				renderCell: ({ api, id }) => api.getAllRowIds().indexOf(id) + 1,
			},
			{
				field: "eq_id",
				headerName: "Equipment",
				flex: 2,
				renderCell: ({ row }) => {
					return row.eq_details[0].name;
				},
			},
			{
				field: "type",
				headerName: "Type",
				flex: 1,
				renderCell: ({ row }) => LOG_TYPES[row.type],
			},
			{
				field: "actions",
				headerName: "Actions",
				flex: 0.5,
				align: "center",
				headerAlign: "center",
				renderCell: ({ row }) => (
					<>
						<Button
							onClick={() => {
								console.log(row.eq_id);
								dispatch({
									type: "edit",
									data: {
										...row,
										equipment: equipments.find(
											(eq) => eq._id === row.eq_id
										),
									},
								});
							}}
						>
							<EditIcon />
						</Button>
						<Button>
							<EditCalendarIcon
								onClick={() =>
									openScheduler({
										...row,
										name: row.eq_details[0].name,
									})
								}
							/>
						</Button>
					</>
				),
			},
		],
		[equipments]
	);

	const dialogColumns = useMemo(
		() => [
			{
				field: "label",
				headerName: "Label",
				headerClassName: "table-secondary--header",
				flex: 1,
			},
			{
				field: "type",
				headerName: "Type",
				headerClassName: "table-secondary--header",
				renderCell: ({ row }) => ITEM_TYPES[row.type],
				flex: 0.5,
			},
			{
				field: "delete",
				headerName: "Actions",
				headerClassName: "table-secondary--header",
				renderCell: ({ row }) => (
					<IconButton color="error" onClick={() => handleDeleteItem(row)}>
						<DeleteIcon />
					</IconButton>
				),
				align: "center",
				headerAlign: "center",
			},
		],
		[dialogState]
	);

	const itemLabelInput = useRef();
	const [fullScreen, setFullScreen] = useState(false);

	const [schedule, setSchedule] = useState(null);
	const openScheduler = (conf) => {
		console.log({
			conf,
		});
		setSchedule(conf);
	};
	const closeScheduler = () => setSchedule(null);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Breadcrumbs
					sx={{ margin: 2 }}
					aria-label="breadcrumb"
					separator={<NavigateNextIcon fontSize="small" />}
					maxItems={2}
					itemsAfterCollapse={2}
				>
					<Typography color="gray">
						{currentLab ? currentLab.name : ""}{" "}
					</Typography>
					<Typography color="gray">Logs</Typography>
					<Typography color="text.primary">Configuration</Typography>
				</Breadcrumbs>
				<Link
					

					sx={{
						marginRight: "26px",
						fontSize: "16px",
						textDecoration: "none",
					}}
					component="button"
					variant="body2"
					onClick={() => navigate("/home")}
				>
					Home
				</Link>
			</Box>

			<Grid
				container
				direction="column"
				width="100%"
				p="4rem"
				pt="1rem"
				spacing="2rem"
			>
				<Grid item ml="auto">
					<Button
						variant="contained"
						onClick={handleOpenDialog}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</Grid>
				<Grid item width="inherit">
					<DataGrid
						columns={columns}
						rows={logConfs}
						getRowId={(row) => {
							return row._id;
						}}
						disableRowSelectionOnClick
						disableColumnSelector
						initialState={{
							pagination: {
								paginationModel: { pageSize: 25 },
							},
							sorting: {
								sortModel: [{ field: "eq_id", sort: "desc" }],
							},
						}}
					/>
				</Grid>
			</Grid>
			<Dialog
				open={dialogState.open}
				onClose={handleCloseDialog}
				fullWidth
				fullScreen={fullScreen}
			>
				<DialogTitle>
					<Grid container>
						<Grid item>
							{dialogState.mode === "edit"
								? "Edit Log Config"
								: "New Log Config"}
						</Grid>
						<Grid item ml="auto">
							<IconButton onClick={() => setFullScreen(!fullScreen)}>
								{fullScreen ? (
									<FullscreenExitIcon />
								) : (
									<FullscreenIcon />
								)}
							</IconButton>
						</Grid>
					</Grid>
				</DialogTitle>
				<DialogContent>
					<Grid container padding={".5rem"} spacing={"1rem"}>
						<Grid item sm={6} xs={12}>
							<Autocomplete
								options={equipments}
								onChange={(_e, newValue) =>
									handleChangeEquipment(newValue)
								}
								value={dialogState.equipment}
								getOptionLabel={(op) => op.name}
								isOptionEqualToValue={(op, val) => op._id === val._id}
								disabled={dialogState.mode === "edit"}
								fullWidth
								renderInput={(params) => (
									<TextField
										{...params}
										error={!!dialogState.errors.equipment}
										helperText={dialogState.errors.equipment?.message}
										label="Equipment"
										required
									/>
								)}
							/>
						</Grid>
						<Grid item sm={6} xs={12}>
							<Autocomplete
								options={LOG_TYPES}
								onChange={(_e, newValue) =>
									handleChangeType(
										newValue === null
											? null
											: LOG_TYPES.indexOf(newValue)
									)
								}
								value={LOG_TYPES[dialogState.type] || null}
								fullWidth
								disabled={dialogState.mode === "edit"}
								renderInput={(params) => (
									<TextField
										{...params}
										error={!!dialogState.errors.type}
										helperText={dialogState.errors.type?.message}
										label="Type"
										required
									/>
								)}
							/>
						</Grid>
						<Grid container item paddingTop="3rem" direction="column">
							<Grid item>
								<Typography variant="overline">
									Add Log Items
								</Typography>
							</Grid>
							<Grid item container spacing={"1rem"}>
								<Grid item sm={6} xs={12}>
									<TextField
										label="Label"
										inputRef={itemLabelInput}
										color="secondary"
										defaultValue={dialogState.itemLabel}
										onBlur={(e) =>
											dispatch({
												type: "itemLabel",
												itemLabel: e.target.value,
											})
										}
										fullWidth
									/>
								</Grid>
								<Grid item sm={4} xs={6}>
									<Autocomplete
										options={ITEM_TYPES}
										value={ITEM_TYPES[dialogState.itemType] || null}
										onChange={(_e, newValue) => {
											dispatch({
												type: "itemType",
												itemType: newValue
													? ITEM_TYPES.indexOf(newValue)
													: null,
											});
										}}
										fullWidth
										renderInput={(params) => (
											<TextField
												{...params}
												label="Item Type"
												color="secondary"
											/>
										)}
									/>
								</Grid>
								<Grid item xs={2} ml="auto" alignSelf="center">
									<Button
										variant="contained"
										onClick={handleAddItem}
										color="secondary"
										size="small"
										disableElevation
									>
										<AddIcon />
									</Button>
								</Grid>
							</Grid>
							<Grid
								item
								mt="2rem"
								width="inherit"
								sx={{
									"& .table-secondary--header": {
										backgroundColor: "#9c27b0", // secondary.light
										color: "white",
									},
								}}
							>
								{!dialogState?.items?.[0] ? (
									<Typography
										variant="overline"
										border={1}
										borderRadius={1}
										p={1}
										color="secondary.light"
									>
										No items added yet
									</Typography>
								) : (
									<DataGrid
										columns={dialogColumns}
										rows={dialogState.items}
										getRowId={(row) => `${row.label}-${row.type}`}
										disableRowSelectionOnClick
										disableColumnSelector
										pagination
										pageSizeOptions={[5, 10, 20]}
										initialState={{
											pagination: {
												paginationModel: { pageSize: 5 },
											},
										}}
									/>
								)}
							</Grid>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={handleCloseDialog}>
						Cancel
					</Button>
					{dialogState.mode === "edit" && (
						<Button
							color="error"
							onClick={handleDelete}
							endIcon={<DeleteIcon />}
						>
							Delete
						</Button>
					)}
					<Button
						onClick={handleSubmit}
						disabled={Object.keys(dialogState.errors).length !== 0}
						endIcon={<SaveIcon />}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={schedule ? true : false}
				onClose={closeScheduler}
				fullScreen
			>
				<DialogTitle>
					Scheduling{" "}
					<Chip
						size="large"
						label={
							<>
								<Typography variant={"h6"}>
									{schedule?.name}{" "}
									<Chip
										label={LOG_TYPES[schedule?.type]}
										color="primary"
										size="small"
									/>
								</Typography>
							</>
						}
					/>
				</DialogTitle>
				<DialogContent>
					<Scheduler item={schedule} type="equipment" />
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={closeScheduler}>
						Exit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default LogConfig;
