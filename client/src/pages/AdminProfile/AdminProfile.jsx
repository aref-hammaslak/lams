import {
	Button,
	Grid,
	TextField,
	Typography,
	ButtonGroup,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { UserAPI } from "../../apis/UserAPI.js";
import { DocAPI } from "../../apis/DocAPI.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
const getUserDefaultValues = (user) => {
	let {
		username: _u,
		lab_owner,
		lab_id: _l,
		_id,
		__v,
		...defaultValues
	} = user;

	defaultValues.license_exp = defaultValues.license_exp
		? dayjs(defaultValues.license_exp)
		: null;
	defaultValues = {
		cv: null,
		ceu: null,
		license: null,
		degree: null,
		training_recs: null,
		...defaultValues,
	};
	return defaultValues;
};
function AdminProfile() {
	const [adminUser, setAdminUser] = useState([]);

	const [error, setError] = useState(null);
	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
		reset,
		setValue,
	} = useForm();

	useEffect(() => {
		UserAPI.getSelf().then(
			(aduser) => {
				setAdminUser(aduser);
			},
			(err) => setError(err)
		);
	}, []);
	// console.log("gettt",adminUser)

	const [updating, setUpdating] = useState(false);
	const updateHandler = (data) => {
		if (data.license_exp)
			data.license_exp = data.license_exp.format("YYYY-MM-DD");

		if (!data.cv) delete data.cv;
		if (!data.ceu) delete data.ceu;
		if (!data.license) delete data.license;
		if (!data.degree) delete data.degree;
		if (!data.training_recs) delete data.training_recs;

		if (!data.username) {
			data.username = adminUser.username; 
		}

		console.log({
			data,
		});
		const userId = adminUser._id;

		setUpdating(true);
		UserAPI.updateUser(userId, data)
			.then(
				(updatedUser) => {
					setAdminUser(updatedUser);
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
				setAdminUser({
					...adminUser,
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
				setLink(`http://localhost:3001/uploads/${doc.filename}`);
			},
			(err) => setError(err)
		);
	};
	return (
		<>
			<Link
				ref={linkOpenerRef}
				sx={{ display: "none" }}
				target="_blank"
				to={link}
			/>
			<Grid
				// container
				// width="1000px"
				mt="3rem"
				marginLeft="4rem"
				// alignItems="center"
				// rowSpacing="2rem"
			>
				<Typography variant="h7">Admin Profile</Typography>

				<Form onSubmit={handleSubmit(updateHandler)}>
					<Grid>
						<Grid container direction={"row"} spacing={1} p="0.5rem">
							<Grid item>
								<TextField label="Name" {...register("name")} sx={{ width: "210px"}} />
							</Grid>
							<Grid item>
								<TextField label="User Name" {...register("username")} sx={{ width: "210px"}} />
							</Grid>
							<Grid item>
								<TextField label="email" {...register("email")} sx={{ width: "210px"}} />
							</Grid>
							<Grid item>
								<TextField
									label="Job Title"
									{...register("job_title")}
									sx={{ width: "210px"}}
								/>
							</Grid>
						</Grid>
						<Grid container direction={"row"} spacing={1} p="0.5rem">
							<Grid item>
								<TextField
									label="Position"
									{...register("position")}
									sx={{ width: "428px"}}
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
										disabled={!adminUser?.cv}
										size="large"
										onClick={() => openFileHandler(adminUser.cv)}
										sx={{ width: "215px", height: "55px" }}
									>
										Open CV
									</Button>
									<LoadingButton
										loading={uploadingCV}
										variant="outlined"
										size="large"
										onClick={() => cvInputRef.current.click()}
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
											onChange={(newDate) => field.onChange(newDate)}
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
									label="License no"
									{...register("license_number")}
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
										// sx={{ display: 'none'}}
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
											disabled={!adminUser?.ceu}
											size="large"
											onClick={() => openFileHandler(adminUser.ceu)}
											sx={{ width: "215px", height: "55px" }}
										>
											Open CEU
										</Button>
										<LoadingButton
											loading={uploadingCEU}
											variant="outlined"
											size="large"
											onClick={() => ceuInputRef.current.click()}
											sx={{ width: "215px", height: "55px" }}
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
											disabled={!adminUser?.license}
											size="large"
											onClick={() =>
												openFileHandler(adminUser.license)
											}
											sx={{ width: "215px", height: "55px" }}
										>
											Open License
										</Button>
										<LoadingButton
											loading={uploadingLicense}
											variant="outlined"
											size="large"
											onClick={() => licenseInputRef.current.click()}
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
											disabled={!adminUser?.degree}
											size="large"
											onClick={() =>
												openFileHandler(adminUser.degree)
											}
											sx={{ width: "215px", height: "55px" }}
										>
											Open Degree
										</Button>
										<LoadingButton
											loading={uploadingDegree}
											variant="outlined"
											size="large"
											onClick={() => degreeInputRef.current.click()}
											sx={{ width: "215px", height: "55px" }}
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
											disabled={!adminUser?.training_recs}
											size="large"
											onClick={() =>
												openFileHandler(adminUser.training_recs)
											}
											sx={{ width: "215px", height: "55px" }}
										>
											Open Training Recs
										</Button>
										<LoadingButton
											loading={uploadingRecs}
											variant="outlined"
											size="large"
											onClick={() => recsInputRef.current.click()}
											sx={{ width: "215px", height: "55px" }}
										>
											<DriveFolderUploadOutlinedIcon />
										</LoadingButton>
									</ButtonGroup>
								</Grid>
							</Grid>
						</Grid>
						<Grid container direction={"row"} spacing={1} p="0.5rem">
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
			</Grid>
		</>
	);
}
export default AdminProfile;
