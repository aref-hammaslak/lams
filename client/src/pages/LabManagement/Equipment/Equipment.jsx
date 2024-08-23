import {
	Paper,
	Button,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Container,
	Tooltip,
	IconButton,
	Typography,
	TextField,
	Stack,
	Breadcrumbs,
	Link,
	MenuItem,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { EquAPI } from "../../../apis/EquAPI.js";
import { DepAPI } from "../../../apis/DepAPI";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import useAuth from "../../../hooks/useAuth.js";
import { LabAPI } from "../../../apis/LabAPI.js";
import { useNavigate } from "react-router-dom";

function Equipment() {
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

	const [editEqu, setEditEqu] = useState(null);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [equs, setEqus] = useState([]);
	const [deps, setDeps] = useState([]);

	const handleEdit = (equ) => {
		setEditEqu(equ);
		setOpen(true);
	};
	const handleCancel = () => {
		setEditEqu(null);
		handleClose();
	};

	useEffect(() => {
		EquAPI.getAll().then(
			(equs) => setEqus(equs),
			(error) => window.flash(error.message, "error")
		);
		DepAPI.getAll().then(
			(deps) => setDeps(deps),
			(error) => window.flash(error.message, "error")
		);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		const data = [...e.target.elements].reduce((accum, el) => {
			accum[el.name] = el.value;
			return accum;
		}, {});
		if (editEqu) {
			EquAPI.updateEqu(editEqu._id, data).then(
				(updatedEqu) => {
					setEqus(
						equs.map((equ) =>
							equ._id === updatedEqu._id ? updatedEqu : equ
						)
					);
					setEditEqu(null);
					handleClose();
				},
				(error) => window.flash(error.message, "error")
			);
		} else {
			EquAPI.createEqu(data).then(
				(equ) => {
					setEqus([equ, ...equs]);
					console.log("equipment", equ);
				},
				(error) => window.flash(error.message, "error")
			);
		}
	};

	const handleDelete = (i) => {
		EquAPI.deleteEqu(equs[i]._id).then((delEqu) =>
			setEqus(equs.filter((equ) => equ._id !== delEqu._id))
		);
	};
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
					<Typography color="gray">
						{currentLab ? currentLab.name : ""}{" "}
					</Typography>
					<Typography color="gray">Settings</Typography>
					<Typography color="text.primary">Equipment</Typography>
				</Breadcrumbs>
				<Link
					sx={{ marginRight: "10px",fontSize:"16px",textDecoration:"none" }}
					component="button"
					variant="body2"
					onClick={() => navigate("/")}
				>
					Home
				</Link>
			</Box>
		

			<Container sx={{ marginTop: "50px" }}>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button
						variant="contained"
						onClick={handleOpen}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</Box>
			</Container>
			<Container maxWidth="lg" sx={{ marginTop: "50px" }}>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell align="left">Department</TableCell>
								<TableCell align="left">Model Number</TableCell>
								<TableCell align="left">Serial</TableCell>
								<TableCell align="left">Manufacture</TableCell>
								<TableCell align="left">RSC Name</TableCell>
								<TableCell align="left">RSC Phone </TableCell>
								<TableCell align="left">Edit</TableCell>
								<TableCell align="left">Delete</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{equs.map((equ, i) => (
								<TableRow
									key={equ._id}
									sx={{
										"&:last-child td, &:last-child th": { border: 0 },
									}}
								>
									<TableCell component="th" scope="row">
										{equ.name}
									</TableCell>
									<TableCell align="left">
										{deps.find((dep) => dep._id === equ.dep_id)?.name}
									</TableCell>
									<TableCell align="left">{equ.model_no}</TableCell>
									<TableCell align="left">{equ.serial}</TableCell>
									<TableCell align="left">{equ.manufacture}</TableCell>
									<TableCell align="left">{equ.rsc_name}</TableCell>
									<TableCell align="left">{equ.rsc_phone}</TableCell>
									<TableCell align="left">
										<Tooltip
											title="Edit"
											placement="right"
											arrow
											enterDelay={500}
											leaveDelay={200}
										>
											<IconButton onClick={() => handleEdit(equ)}>
												<EditIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell align="left">
										<Tooltip
											title="Delete"
											placement="right"
											arrow
											enterDelay={500}
											leaveDelay={200}
											onClick={() => handleDelete(i)}
										>
											<IconButton>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
			<React.Fragment>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>
						{editEqu ? "Edit Equipment" : "Create New Equipment"}
					</DialogTitle>
					<DialogContent>
						<Form onSubmit={handleSubmit}>
							<Stack spacing={2}>
								<Stack direction="row" spacing={2}>
									<TextField
										label="Name"
										type="text"
										name="name"
										variant="outlined"
										sx={{ width: "400px" }}
										defaultValue={editEqu ? editEqu.name : ""}
									/>
									<Box width="400px">
										<TextField
											label="Select Department"
											name="dep_id"
											defaultValue={editEqu ? editEqu.dep_id : ""}
											select
											fullWidth
											size="large"
											color="primary"
										>
											{deps.map((dep) => (
												<MenuItem key={dep._id} value={dep._id}>
													{dep.name}
												</MenuItem>
											))}
										</TextField>
									</Box>
								</Stack>
								<Stack direction="row" spacing={2}>
									<TextField
										label="Modal No"
										type="text"
										name="model_no"
										defaultValue={editEqu ? editEqu.model_no : ""}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
									<TextField
										label="Serial No"
										type="text"
										name="serial"
										defaultValue={editEqu ? editEqu.serial : ""}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
								</Stack>
								<Stack direction="row" spacing={4}>
									<TextField
										label="Manufacture"
										type="text"
										name="manufacture"
										defaultValue={editEqu ? editEqu.manufacture : ""}
										variant="outlined"
										sx={{ width: "900px" }}
									/>
								</Stack>
								<Stack direction="row" spacing={2}>
									<TextField
										label="RSC Name"
										type="text"
										name="rsc_name"
										defaultValue={editEqu ? editEqu.rsc_name : ""}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
									<TextField
										label="RSC Phone"
										type="text"
										name="rsc_phone"
										defaultValue={editEqu ? editEqu.rsc_phone : ""}
										variant="outlined"
										sx={{ width: "400px" }}
									/>
								</Stack>
								<Stack spacing={2} direction="row">
									<Button onClick={handleClose} type="submit">
										{editEqu ? "Update" : "Save"}
									</Button>
									<Button onClick={handleCancel}>Cancel</Button>
								</Stack>
							</Stack>
						</Form>
					</DialogContent>
				</Dialog>
			</React.Fragment>
		</>
	);
}
export default Equipment;
