import {
	Button,
	ButtonGroup,
	Grid,
	Box,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { RHFAutocomplete } from "../../../components/RHFAutocomplete/index.jsx";
import { PMServiceAPI } from "../../../apis/PMServiceAPI.js";
import { EquAPI } from "../../../apis/EquAPI.js";
import { DocAPI } from "../../../apis/DocAPI.js";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import useAuth from "../../../hooks/useAuth.js";
import { LabAPI } from "../../../apis/LabAPI.js";
import { Link as MUILink } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PMServiceDefaultValues = (calibration) => {
	let { __v, ...defaultValues } = calibration;
	defaultValues.date = defaultValues.date ? dayjs(defaultValues.date) : null;
	defaultValues = {
		...defaultValues,
	};
	return defaultValues;
};
function PMService() {
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
	const [pmservices, setPmservices] = useState([]);
	const [equs, setEqus] = useState(new Map());

	const {
		handleSubmit,
		register,
		watch,
		reset,
		setValue,
		control,
		formState: { errors },
	} = useForm();

	const [updating, setUpdating] = useState(false);

	const onSubmit = ({ _id, ...data }) => {
		console.log(_id ? `Update ${_id}` : "Create");
		console.log({
			data,
		});
		if (data.date) data.date = data.date.format("YYYY-MM-DD");
		if (!data.document) delete data.document;

		if (_id) {
			PMServiceAPI.update(_id, data).then(
				(pmservice) => {
					setPmservices(
						pmservices.map((t) =>
							t._id === pmservice._id ? pmservice : t
						)
					);
					const defaultValues = PMServiceDefaultValues(pmservice);
					reset(defaultValues);
					setOpen(false);
				},
				(err) => setError(err)
			);
		} else {
			setUpdating(true);

			PMServiceAPI.create(data).then(
				(pmservice) => {
					setPmservices([pmservice, ...pmservices]);
					setOpen(false);
				},
				(err) => setError(err)
			);
		}
	};
	const linkOpenerRef = useRef();
	const [link, setLink] = useState(null);
	useEffect(() => {
		if (link) linkOpenerRef.current.click();
	}, [link]);

	const documentInputRef = useRef();
	const [uploadingDocument, setUploadingDocument] = useState(false);

	const uploadHandler = (name, file, setUploading) => {
		if (!file) return;

		setUploading(true);

		DocAPI.upload(name, file).then(
			(doc) => {
				setUploading(false);
				setValue(name, doc._id);
			},
			(err) => {
				setUploading(false);
				setValue(name, undefined);
			}
		);
	};

	const openFileHandler = (doc_id) => {
		DocAPI.get(doc_id).then(
			(doc) => {
				setLink(`http://localhost:3001/uploads/${doc.filename}`);
			},
			(err) => setError(err)
		);
	};
	const handleDelete = () => {
		const _id = watch("_id");
		console.log(`Delete ${_id}`);
		PMServiceAPI.destroy(_id).then(
			(pmservice) => {
				setPmservices(pmservices.filter((t) => t._id !== pmservice._id));
				setOpen(false);
			},
			(err) => setError(err)
		);
	};

	console.log(equs);
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
				headerName: "Equipment Name",
				flex: 0.75,
				renderCell: ({ row }) => equs.get(row.eq_id),
				align: "center",
				headerAlign: "center",
			},
			{
				field: "description",
				headerName: "Description",
				flex: 2,
			},
			{
				field: "date",
				headerName: "date",
				flex: 0.5,
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
								console.log("row", row);
								reset(PMServiceDefaultValues(row));
								handleOpen();
							}}
						>
							<EditIcon />
						</Button>
					</>
				),
			},
		],
		[pmservices, equs]
	);

	useEffect(() => {
		PMServiceAPI.getAll().then(
			(pmservices) => setPmservices(pmservices),
			(err) => setError(err)
		);
		EquAPI.getAll().then(
			(equs) => setEqus(new Map(equs.map((d) => [d._id, d.name]))),
			(err) => setError(err)
		);
	}, []);

	return (
		<>
			<Link
				ref={linkOpenerRef}
				sx={{ display: "none" }}
				target="_blank"
				to={link}
			/>
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

					<Typography color="gray">Management</Typography>
					<Typography color="text.primary">PM Service</Typography>
				</Breadcrumbs>
				<MUILink
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
				</MUILink>
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
						onClick={() => {
							reset({ _id: null });
							handleOpen();
						}}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</Grid>
				<Grid item width="inherit">
					<DataGrid
						columns={columns}
						rows={pmservices}
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
						(watch("_id") ? "Edit PM Service" : "New PM Service")}
				</DialogTitle>
				<DialogContent>
					<input style={{ display: "none" }} {...register("_id")} />
					<Grid container width="inherit" mt="1rem" rowSpacing="2rem">
						<Grid item xs={12}>
							<RHFAutocomplete
								name="eq_id"
								label="Equipment"
								control={control}
								options={[...equs.keys()]}
								rules={{ required: true }}
								autocompleteProps={{
									getOptionLabel: (op) => equs.get(op),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<Controller
								name="date"
								control={control}
								render={({ field }) => (
									<DatePicker
										sx={{ width: "100% " }}
										openTo="year"
										views={["year", "month", "day"]}
										value={field.value}
										onChange={(newDate) => field.onChange(newDate)}
										slotProps={{
											textField: {
												label: (
													<span>
														Date
														<span style={{ color: "grey" }}>
															*
														</span>
													</span>
												),
											},
										}}
									/>
								)}
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
						<Grid item>
							<input
								style={{ display: "none" }}
								type="file"
								ref={documentInputRef}
								onChange={(e) =>
									uploadHandler(
										"document",
										e.target.files[0],
										setUploadingDocument
									)
								}
							/>
							<TextField
								sx={{ display: "none" }}
								{...register("document")}
							/>
							<ButtonGroup>
								<Button
									disabled={!watch("document")}
									size="large"
									onClick={() => openFileHandler(watch("document"))}
									sx={{ width: "215px", height: "55px" }}
								>
									Open Doc
								</Button>
								<LoadingButton
									loading={uploadingDocument}
									variant="outlined"
									size="large"
									onClick={() => documentInputRef.current.click()}
									sx={{ width: "215px", height: "55px" }}
								>
									<DriveFolderUploadOutlinedIcon />
								</LoadingButton>
							</ButtonGroup>
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
export default PMService;
