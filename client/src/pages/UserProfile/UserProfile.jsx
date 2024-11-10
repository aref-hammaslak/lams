import {
	Box,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	Divider,
	FormControlLabel,
	Switch,
	Button,
	Stack,
	Grid,
	Breadcrumbs,
	TextField,
	MenuItem,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	ButtonGroup,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	IconButton,
	Snackbar,
	Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { RHFAutocomplete } from "../../components/RHFAutocomplete/RHFAutocomplete.jsx";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import React, { useEffect, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { UserAPI } from "../../apis/UserAPI.js";
import { DocAPI } from "../../apis/DocAPI.js";
import useAuth from "../../hooks/useAuth.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import { BoxController } from "../../components/BoxController/index.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { LabAPI } from "../../apis/LabAPI.js";
import Home from "../Home/Home.jsx";
import { Link as MUILink } from "@mui/material";

const BASE_URL = import.meta.env.PROD ? '/api/' : 'http://localhost:3001/api/';

const USER_ROLES = {
	Staff: [1001],
	Supervisor: [1001, 1923],
};

const getUserDefaultValues = (user) => {
	let {
		// username: _u,
		lab_owner,
		lab_id: _l,
		_id,
		__v,
		...userValues
	} = user;
	let defaultValues = {
		pfp: null,
		name: null,
		email: null,
		job_title: null,
		position: null,
		cv: null,
		license_type: null,
		license_no: null,
		ceu_no: 0,
		ceu: null,
		license: null,
		degree: null,
		training_recs: null,
		...userValues,
	};
	defaultValues.roles = defaultValues.roles.includes(1923)
		? "Supervisor"
		: "Staff";
	defaultValues.license_exp = defaultValues.license_exp
		? dayjs(defaultValues.license_exp)
		: null;
	return defaultValues;
};

function UserProfile() {
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		// resetDialog({ users: null });
		resetDialog();
	};
	const [error, setError] = useState(null);
	const { auth, setAuth } = useAuth();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
		reset,
		setValue,
	} = useForm();

	const {
		handleSubmit: handleSubmitDialog,
		register: registerDialog,
		control: controlDialog,
		watch: watchDialog,
		formState: { errors: errorsDialog },
		reset: resetDialog,
	} = useForm();
	const watchPassword = watchDialog("password", "");
	useEffect(() => {
		UserAPI.getAll().then(
			(users) => setUsers(users),
			(error) => setError(error)
		);
	}, []);

	const loadUser = (user) => {
		UserAPI.get(user._id).then(
			(user) => {
				console.log({
					user,
				});
				if (user.pfp) {
					DocAPI.get(user.pfp).then((doc) =>
						setSelectedUser((prev) => {
							if (prev.pfp === doc._id)
								return {
									...prev,
									pfp_doc: doc,
								};
						})
					);
				}
				setSelectedUser(user);
				const defaultValues = getUserDefaultValues(user);
				reset(defaultValues);
				pfpInputRef.current.target.value = null;
			},
			(err) => setError(err)
		);
	};

	const addUsersubmitHandler = ({ name, username, email, password }) => {
		UserAPI.createUser(name, username, email, password).then(
			(user) => {
				setAuth(user);
				setUsers((prevUsers) => [...prevUsers, user]);

				setSelectedUser(null);
				handleClose();
				// setUsers(null);
				// setOpen(false);
			},
			(error) => {
				console.log("Error message:", error.message);
				if (error.message === "Request failed with status code 409") {
					setErrorMessage("This Username or Email has been taken");
				} else {
					setErrorMessage("This email has been taken");
				}
			}
		);
		if (password !== watchPassword) {
			setError("confirmPassword", { message: "Password does not match" });
			return;
		}
	};

	// delete user
	const deleteUser = (userId) => {
		UserAPI.deleteUser(userId).then(
			() => {
				setUsers(users.filter((user) => user._id !== userId));

				setSelectedUser(null);

				reset();
			},
			(error) => setError(error)
		);
	};

	const handleDeleteUser = (userId) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			deleteUser(userId);
		}
	};

	const [updating, setUpdating] = useState(false);
	const updateHandler = (data) => {
		data.roles = USER_ROLES[data.roles];

		if (data.license_exp)
			data.license_exp = data.license_exp.format("YYYY-MM-DD");

		Object.keys(data).forEach((key) => {
			if (data[key] === null || data[key] === undefined) delete data[key];
		});

		console.log({
			data,
		});
		const userId = selectedUser._id;

		setUpdating(true);
		UserAPI.updateUser(userId, data)
			.then(
				(updatedUser) => {
					setUsers(
						users.map((user) =>
							user._id === userId ? updatedUser : user
						)
					);
					setSelectedUser(updatedUser);
					const defaultValues = getUserDefaultValues(updatedUser);
					reset(defaultValues);
				},
				(error) => {
					setError(error);
				}
			)
			.finally(() => setUpdating(false));
	};

	const linkOpenerRef = useRef();
	const [link, setLink] = useState(null);
	useEffect(() => {
		if (link) linkOpenerRef.current.click();
	}, [link]);

	const cvInputRef = useRef();
	const [uploadingCV, setUploadingCV] = useState(false);

	const ceuInputRef = useRef();
	const [uploadingCEU, setUploadingCEU] = useState(false);

	const licenseInputRef = useRef();
	const [uploadingLicense, setUploadingLicense] = useState(false);

	const degreeInputRef = useRef();
	const [uploadingDegree, setUploadingDegree] = useState(false);

	const recsInputRef = useRef();
	const [uploadingRecs, setUploadingRecs] = useState(false);

	const uploadHandler = (name, file, setUploading) => {
		if (!file) return;

		setUploading(true);

		DocAPI.upload(name, file).then(
			(doc) => {
				setUploading(false);
				setValue(name, doc._id);
				setSelectedUser({
					...selectedUser,
					[name]: doc._id,
				});
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
				setLink(`${BASE_URL}/api/uploads/${doc.filename}`);
			},
			(err) => setError(err)
		);
	};

	const toggleUser = (user) => {
		UserAPI.toggleUser(user._id).then(
			(newUser) =>
				setUsers(users.map((u) => (u._id === newUser._id ? newUser : u))),
			(err) => setError(err)
		);
	};

	const pfpInputRef = useRef();
	const [uploadingPfp, setUploadingPfp] = useState(false);

	const [labs, setLabs] = useState([]);
	const [currentLab, setCurrentLab] = useState(null);

	useEffect(() => {
		LabAPI.getAll().then((labs) => {
			setLabs(labs);
			const lab = labs.find((lab) => lab._id === auth.lab_id);
			setCurrentLab(lab);
		});
	}, []);

	// useEffect(() => {
	// 	const lab = labs.find((lab) => lab._id === auth.lab_id);
	// 	setCurrentLab(lab);
	// }, [labs, auth.lab_id]);

	return (
		<>
			<Box
				m={2}
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Breadcrumbs
					aria-label="breadcrumb"
					separator={<NavigateNextIcon fontSize="small" />}
					maxItems={2}
					itemsAfterCollapse={2}
				>
					<Typography color="gray" variant="body2">
						{currentLab ? currentLab.name : ""}{" "}
					</Typography>
					<Typography color="text.primary" variant="body2">
						Users Profile
					</Typography>
				</Breadcrumbs>
				<MUILink
					sx={{
						marginRight: "10px",
						fontSize: "16px",
						textDecoration: "none",
					}}
					component="button"
					variant="body2"
					onClick={() => navigate("/")}
				>
					Home
				</MUILink>
			</Box>

			<Link
				ref={linkOpenerRef}
				sx={{ display: "none" }}
				target="_blank"
				to={link}
			/>

			<Grid container>
				<Grid
					sx={{
						margin: "10px",
						width: "250px",
					}}
				>
					<Stack direction="column">
						<Button variant="contained" size="large" onClick={handleOpen}>
							Add New User
						</Button>
					</Stack>

					<List>
						{users.map((user, index) => (
							<div key={user._id}>
								<ListItem disablePadding>
									<ListItemButton onClick={() => loadUser(user)}>
										<ListItemText
											primary={user.name || user.username}
										/>
										<FormControlLabel
											control={
												<Switch
													size="large"
													color="primary"
													checked={user.active}
													onClick={() => toggleUser(user)}
												/>
											}
										/>
										<DeleteIcon
											sx={{ color: "rgba(0, 0, 0, 0.7)" }}
											onClick={() => handleDeleteUser(user._id)}
										></DeleteIcon>
									</ListItemButton>
								</ListItem>
								{index !== users.length - 1 && <Divider />}
							</div>
						))}
					</List>
				</Grid>

				<Grid container width="900px">
					<input
						style={{ display: "none" }}
						type="file"
						ref={pfpInputRef}
						onChange={(e) =>
							uploadHandler("pfp", e.target.files[0], setUploadingPfp)
						}
					/>
					{selectedUser && (
						<>
							<BoxController
								componentProps={{
									hover: false,
								}}
								onHoverProps={{
									hover: true,
								}}
								renderComponent={(props) => (
									<ImageList
										sx={{
											width: "10rem",
											height: "10rem",
											borderRadius: "20px",
										}}
									>
										<ImageListItem cols={12}>
											<img
												alt="profile-image"
												src={
													selectedUser.pfp_doc
														? `http://localhost:3001/uploads/${selectedUser.pfp_doc.filename}`
														: "pfp_placeholder.png"
												}
											/>
											{props.hover && (
												<ImageListItemBar
													subtitle="Edit"
													actionIcon={
														<IconButton
															sx={{ color: "white" }}
															onClick={() =>
																pfpInputRef.current.click()
															}
														>
															<EditIcon />
														</IconButton>
													}
												/>
											)}
										</ImageListItem>
									</ImageList>
								)}
							></BoxController>
							<Form onSubmit={handleSubmit(updateHandler)}>
								<TextField
									sx={{ display: "none" }}
									{...register("pfp")}
								/>
								<Grid>
									<Grid
										container
										direction={"row"}
										spacing={1}
										p="0.5rem"
										alignItems="center"
									>
										<Grid item>
											<TextField
												sx={{ width: "210px" }}
												label="Name"
												{...register("name")}
											/>
										</Grid>
										<Grid item>
											<TextField
												sx={{ width: "210px" }}
												label="email"
												{...register("email")}
											/>
										</Grid>
										<Grid item>
											<TextField
												sx={{ width: "210px" }}
												label="Job Title"
												{...register("job_title")}
											/>
										</Grid>
										<Grid item>
											<TextField
												sx={{ width: "210px" }}
												label="UserName"
												{...register("username")}
											/>
										</Grid>
										<Grid
											container
											direction={"row"}
											spacing={1}
											p="0.5rem"
											alignItems="center"
										>
											<Grid item>
												<TextField
													sx={{ width: "865px" }}
													label="Position"
													{...register("position")}
												/>
											</Grid>
										</Grid>
										{/* <Grid
										item
										sm={5.86}
										xs={8}
										sx={{ width: "100%" }}
									>
										<Grid item>
										<TextField
											fullWidth
											label="Position"
											{...register("position")}
										/>
										</Grid>
									</Grid> */}
									</Grid>
									<Grid
										container
										direction={"row"}
										spacing={1}
										p="0.5rem"
									>
										<Grid item sm={5.86} xs={8}>
											<RHFAutocomplete
												name="roles"
												label="Roles"
												control={control}
												options={Object.keys(USER_ROLES)}
												rules={{ required: true }}
												sx={{ width: "215px", height: "55px" }}
											/>
										</Grid>
										<Grid item>
											<input
												// sx={{ display: 'none'}}
												style={{ display: "none" }}
												type="file"
												ref={cvInputRef}
												onChange={(e) =>
													uploadHandler(
														"cv",
														e.target.files[0],
														setUploadingCV
													)
												}
											/>
											<TextField
												sx={{ display: "none" }}
												{...register("cv")}
											/>
											<ButtonGroup>
												<Button
													disabled={!selectedUser?.cv}
													size="large"
													onClick={() =>
														openFileHandler(selectedUser.cv)
													}
													sx={{ width: "215px", height: "55px" }}
												>
													Open CV
												</Button>
												<LoadingButton
													loading={uploadingCV}
													variant="outlined"
													size="large"
													onClick={() =>
														cvInputRef.current.click()
													}
													sx={{ width: "215px", height: "55px" }}
												>
													<DriveFolderUploadOutlinedIcon />
												</LoadingButton>
											</ButtonGroup>
										</Grid>
									</Grid>
									<Grid
										container
										direction={"row"}
										spacing={1}
										alignItems="center"
										p="0.5rem"
									>
										<Grid item>
											<Controller
												name="license_exp"
												control={control}
												render={({ field }) => (
													<DatePicker
														openTo="year"
														views={["year", "month", "day"]}
														value={field.value}
														onChange={(newDate) =>
															field.onChange(newDate)
														}
														slotProps={{
															textField: {
																label: "License Exp",
															},
														}}
														// renderInput={(params) => (
														// 	<TextField
														// 		{...params}
														// 		label="License Exp"
														// 	/>
														// )}
														sx={{ width: "210px" }}
													/>
												)}
											/>
										</Grid>
										<Grid item>
											<TextField
												label="License Type"
												{...register("license_type")}
												sx={{ width: "210px" }}
											/>
										</Grid>
										<Grid item>
											<TextField
												label="License Number"
												{...register("license_no")}
												sx={{ width: "210px" }}
											/>
										</Grid>
										<Grid item>
											<TextField
												label="Number of CEUs"
												{...register("ceu_no", {
													valueAsNumber: true,
												})}
												sx={{ width: "210px" }}
											/>
										</Grid>
										<Grid
											container
											direction={"row"}
											spacing={1}
											alignItems="center"
											p="0.5rem"
										>
											<Grid item>
												<input
													style={{ display: "none" }}
													type="file"
													ref={ceuInputRef}
													onChange={(e) =>
														uploadHandler(
															"ceu",
															e.target.files[0],
															setUploadingCEU
														)
													}
												/>
												<TextField
													sx={{ display: "none" }}
													{...register("ceu")}
												/>
												<ButtonGroup>
													<Button
														disabled={!selectedUser?.ceu}
														size="large"
														onClick={() =>
															openFileHandler(selectedUser.ceu)
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														Open CEU
													</Button>
													<LoadingButton
														loading={uploadingCEU}
														variant="outlined"
														size="large"
														onClick={() =>
															ceuInputRef.current.click()
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														<DriveFolderUploadOutlinedIcon />
													</LoadingButton>
												</ButtonGroup>
											</Grid>
											<Grid item>
												<input
													// sx={{ display: 'none'}}
													style={{ display: "none" }}
													type="file"
													ref={licenseInputRef}
													onChange={(e) =>
														uploadHandler(
															"license",
															e.target.files[0],
															setUploadingLicense
														)
													}
												/>
												<TextField
													sx={{ display: "none" }}
													{...register("license")}
												/>
												<ButtonGroup>
													<Button
														disabled={!selectedUser?.license}
														size="large"
														onClick={() =>
															openFileHandler(
																selectedUser.license
															)
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														Open License
													</Button>
													<LoadingButton
														loading={uploadingLicense}
														variant="outlined"
														size="large"
														onClick={() =>
															licenseInputRef.current.click()
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														<DriveFolderUploadOutlinedIcon />
													</LoadingButton>
												</ButtonGroup>
											</Grid>
										</Grid>
										<Grid
											container
											direction={"row"}
											spacing={1}
											alignItems="center"
											p="0.5rem"
										>
											<Grid item>
												<input
													// sx={{ display: 'none'}}
													style={{ display: "none" }}
													type="file"
													ref={degreeInputRef}
													onChange={(e) =>
														uploadHandler(
															"degree",
															e.target.files[0],
															setUploadingDegree
														)
													}
												/>
												<TextField
													sx={{ display: "none" }}
													{...register("degree")}
												/>
												<ButtonGroup>
													<Button
														disabled={!selectedUser?.degree}
														size="large"
														onClick={() =>
															openFileHandler(
																selectedUser.degree
															)
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														Open Degree
													</Button>
													<LoadingButton
														loading={uploadingDegree}
														variant="outlined"
														size="large"
														onClick={() =>
															degreeInputRef.current.click()
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														<DriveFolderUploadOutlinedIcon />
													</LoadingButton>
												</ButtonGroup>
											</Grid>
											<Grid item>
												<input
													// sx={{ display: 'none'}}
													style={{ display: "none" }}
													type="file"
													ref={recsInputRef}
													onChange={(e) =>
														uploadHandler(
															"training_recs",
															e.target.files[0],
															setUploadingRecs
														)
													}
												/>
												<TextField
													sx={{ display: "none" }}
													{...register("training_recs")}
												/>
												<ButtonGroup>
													<Button
														disabled={
															!selectedUser?.training_recs
														}
														size="large"
														onClick={() =>
															openFileHandler(
																selectedUser.training_recs
															)
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														Open Training Recs
													</Button>
													<LoadingButton
														loading={uploadingRecs}
														variant="outlined"
														size="large"
														onClick={() =>
															recsInputRef.current.click()
														}
														sx={{
															width: "215px",
															height: "55px",
														}}
													>
														<DriveFolderUploadOutlinedIcon />
													</LoadingButton>
												</ButtonGroup>
											</Grid>
										</Grid>
									</Grid>
									<Grid
										container
										direction={"row"}
										spacing={1}
										p="0.5rem"
									>
										<Grid item>
											<LoadingButton
												loading={updating}
												variant="contained"
												size="large"
												color="success"
												type="submit"
											>
												Apply
											</LoadingButton>
										</Grid>
									</Grid>
								</Grid>
							</Form>
						</>
					)}
				</Grid>
			</Grid>

			<React.Fragment>
				<Snackbar
					open={!!errorMessage}
					autoHideDuration={6000}
					onClose={() => setErrorMessage("")}
				>
					<Alert onClose={() => setErrorMessage("")} severity="error">
						{errorMessage}
					</Alert>
				</Snackbar>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Create New User</DialogTitle>
					<DialogContent>
						<Form onSubmit={handleSubmitDialog(addUsersubmitHandler)}>
							<Stack spacing={4}>
								<Stack spacing={3}>
									<TextField
										label="Name"
										type="text"
										{...registerDialog("name", { required: true })}
										error={!!errors.name}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
								</Stack>
								<Stack spacing={3}>
									<TextField
										label="UserName"
										type="text"
										{...registerDialog("username", {
											required: true,
										})}
										error={!!errors.username}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
								</Stack>
								<Stack spacing={3}>
									<TextField
										label="Email"
										type="text"
										{...registerDialog("email", { required: true })}
										error={!!errors.email}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
								</Stack>
								<Stack spacing={3}>
									<TextField
										label="Password"
										type="text"
										{...registerDialog("password", {
											required: true,
										})}
										error={!!errors.password}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
								</Stack>
								<Stack spacing={3}>
									<TextField
										label="Confirm Password"
										type="text"
										{...registerDialog("confirm password", {
											required: true,
											validate: {
												matchPassword: (value) =>
													value === watchPassword ||
													"Password does not match",
											},
										})}
										error={!!errors.confirmpassword}
										helperText={
											errors.confirmPassword &&
											errors.confirmPassword.message
										}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
								</Stack>
								<Stack spacing={2} direction="row">
									<Button type="submit">Save</Button>
									<Button onClick={handleClose}>Cancel</Button>
								</Stack>
							</Stack>
						</Form>
					</DialogContent>
				</Dialog>
				<DevTool control={control} />
			</React.Fragment>
		</>
	);
}
export default UserProfile;
