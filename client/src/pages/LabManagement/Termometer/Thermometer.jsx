import {
	Button,
	Box,
	Link,
	Grid,
	Breadcrumbs,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EditIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

// import { SurfAPI } from "../../apis/SurfAPI";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import * as React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { RHFAutocomplete } from "../../../components/RHFAutocomplete/index.jsx";
import { ThermAPI } from "../../../apis/ThermAPI.js";
import { DepAPI } from "../../../apis/DepAPI.js";
import useAuth from "../../../hooks/useAuth.js";
import { LabAPI } from "../../../apis/LabAPI.js";
import PageHeader from "../../../components/Global/PageHeader.jsx";

function Thermometer() {
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
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [therms, setTherms] = useState([]);
	const [deps, setDeps] = useState(new Map());

	const {
		handleSubmit,
		register,
		watch,
		reset,
		control,
		formState: { errors },
	} = useForm();

	const onSubmit = ({ _id, ...data }) => {
		console.log(_id ? `Update ${_id}` : "Create");
		console.log({
			data,
		});
		if (_id) {
			ThermAPI.update(_id, data).then(
				(therm) => {
					setTherms(therms.map((t) => (t._id === therm._id ? therm : t)));
					setOpen(false);
				},
				(err) => setError(err)
			);
		} else {
			ThermAPI.create(data).then(
				(therm) => {
					setTherms([therm, ...therms]);
					setOpen(false);
				},
				(err) => setError(err)
			);
		}
	};
	const handleDelete = () => {
		const _id = watch("_id");
		console.log(`Delete ${_id}`);
		ThermAPI.destroy(_id).then(
			(therm) => {
				setTherms(therms.filter((t) => t._id !== therm._id));
				setOpen(false);
			},
			(err) => setError(err)
		);
	};

	console.log(deps);
	const columns = useMemo(
		() => [
			{
				field: "_id",
				headerName: "ID",
				flex: 0,
				renderCell: ({ api, id }) => api.getAllRowIds().indexOf(id) + 1,
			},
			{
				field: "name",
				headerName: "Name",
				flex: 0.5,
			},
			{
				field: "dep_id",
				headerName: "Department",
				flex: 0.5,
				renderCell: ({ row }) => deps.get(row.dep_id),
			},
			{
				field: "description",
				headerName: "Description",
				flex: 2,
			},
			{
				field: "temp_min",
				headerName: "Min",
			},
			{
				field: "temp_max",
				headerName: "Max",
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
								reset(row);
								handleOpen();
							}}
						>
							<EditIcon />
						</Button>
						<Button>
							<EditCalendarIcon />
						</Button>
					</>
				),
			},
		],
		[therms, deps]
	);

	useEffect(() => {
		ThermAPI.getAll().then(
			(therms) => setTherms(therms),
			(err) => setError(err)
		);
		DepAPI.getAll().then(
			(deps) => setDeps(new Map(deps.map((d) => [d._id, d.name]))),
			(err) => setError(err)
		);
	}, []);

	return (
		<>
			<Grid
				direction="column"
				className="mx-auto space-y-4 container py-8"	
			>
				<div className="flex justify-between items-center">
					<PageHeader title='Thermometers' subtitle='Manage lab thermometers ' />
					<Button
						variant="contained"
						onClick={handleOpen}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</div>
				<Grid className="bg-white" item width="inherit">
					<DataGrid
						columns={columns}
						rows={therms}
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
								sortModel: [{ field: "name", sort: "asc" }],
							},
						}}
					/>
				</Grid>
			</Grid>
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				component={"form"}
				onSubmit={handleSubmit(onSubmit)}
			>
				<DialogTitle>
					{watch("name") ||
						(watch("_id") ? "Edit Thermometer" : "New Thermometer")}
				</DialogTitle>
				<DialogContent>
					<input style={{ display: "none" }} {...register("_id")} />
					<Grid container width="inherit" mt="1rem" rowSpacing="2rem">
						<Grid item xs={12}>
							<TextField
								{...register("name", { required: true })}
								label="Name"
								fullWidth
								error={!!errors.name}
								helperText={errors.name && "(required)"}
							/>
						</Grid>
						<Grid item xs={12}>
							<RHFAutocomplete
								name="dep_id"
								label="Department"
								control={control}
								options={[...deps.keys()]}
								rules={{ required: true }}
								autocompleteProps={{
									getOptionLabel: (op) => deps.get(op),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register("description")}
								label="Description"
								fullWidth
								multiline
								rows={5}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register("serial")}
								label="Serial Number"
								fullWidth
							/>
						</Grid>
						<Grid item sm={2.5} alignSelf="center">
							<Typography variant="body1">Temp. Range:</Typography>
						</Grid>
						<Grid item sm={2}>
							<TextField
								size="small"
								{...register("temp_min", { required: true })}
								label="Min"
								type="number"
								error={errors.temp_min}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">°C</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={0.5} alignSelf="center" justifySelf="center">
							<Typography variant="body2" align="center">
								to
							</Typography>
						</Grid>
						<Grid item sm={2}>
							<TextField
								size="small"
								{...register("temp_max", { required: true })}
								label="Max"
								type="number"
								error={errors.temp_max}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">°C</InputAdornment>
									),
								}}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={handleClose}>
						Cancel
					</Button>
					{watch("_id") && (
						<Button
							color="error"
							endIcon={<DeleteIcon />}
							onClick={handleDelete}
						>
							Delete
						</Button>
					)}
					<Button endIcon={<SaveIcon />} type="submit">
						Save
					</Button>
				</DialogActions>
			</Dialog>
			<DevTool control={control} />
		</>
	);
}

export default Thermometer;
