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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EditIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import useAuth from "../../../hooks/useAuth.js";
import { LabAPI } from "../../../apis/LabAPI.js";
import { SurfAPI } from "../../../apis/SurfAPI";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { DepAPI } from "../../../apis/DepAPI.js";
import { RHFAutocomplete } from "../../../components/RHFAutocomplete/index.jsx";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/Global/PageHeader.jsx";

function Surface() {
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
	const [surfs, setSurfs] = useState([]);
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
		if (_id) {
			SurfAPI.update(_id, data).then(
				(surf) => {
					setSurfs(surfs.map((s) => (s._id === surf._id ? surf : s)));
					setOpen(false);
				},
				(err) => setError(err)
			);
		} else {
			SurfAPI.create(data).then(
				(surf) => {
					setSurfs([surf, ...surfs]);
					setOpen(false);
				},
				(err) => setError(err)
			);
		}
	};
	const handleDelete = () => {
		const _id = watch("_id");
		console.log(`Delete ${_id}`);
		SurfAPI.destroy(_id).then(
			(surf) => {
				setSurfs(surfs.filter((s) => s._id !== surf._id));
				setOpen(false);
			},
			(err) => setError(err)
		);
	};

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
				field: "maintenance_proc",
				headerName: "Maintenance",
				flex: 2,
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
								console.log({
									row,
								});
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
		[surfs, deps]
	);

	useEffect(() => {
		SurfAPI.getAll().then(
			(surfs) => setSurfs(surfs),
			(error) => setError(error)
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
					<PageHeader title='Surfaces' subtitle='Manage lab surfaces ' />
					<Button
						variant="contained"
						onClick={handleOpen}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</div>
				<Grid item width="inherit">
					<DataGrid
						columns={columns}
						rows={surfs}
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
						(watch("_id") ? "Edit Surface" : "New Surface")}
				</DialogTitle>
				<DialogContent>
					<input style={{ display: "none" }} {...register("_id")} />
					<Grid
						container
						width="inherit"
						mt="1rem"
						spacing="2rem"
						direction="column"
					>
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
								{...register("maintenance_proc")}
								label="Maintenance"
								fullWidth
								multiline
								minRows={3}
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

export default Surface;
