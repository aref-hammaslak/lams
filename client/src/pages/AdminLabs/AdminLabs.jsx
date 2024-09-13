import React, { useEffect, useState } from "react";
import { LabAPI } from "../../apis/LabAPI";
import { UserAPI } from "../../apis/UserAPI.js";
import useAuth from "../../hooks/useAuth.js";
import Home from "../Home/Home.jsx";

import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

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
	Tooltip,
	IconButton,
	Typography,
	Container,
	TextField,
	Stack,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PageHeader from "../../components/Global/PageHeader.jsx";

const HoverableTableRow = styled(TableRow)`
	&:hover {
		cursor: pointer;
		background-color: lightgray;
	}
`;

function AdminLabs() {
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		
		setOpen(true);
	};

	const handleCancel = () => {
		setSelectedLab(null);
		handleClose();
	};

	
	

	const handleClose = () => {
		setOpen(false);
	};
	const [error, setError] = useState(null);
	const [labs, setLabs] = useState([]);
	const [selectedLab, setSelectedLab] = useState(null);
	// const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		LabAPI.getAll().then(
			(labs) => setLabs(labs),
			console.log(labs)
			// (error) => window.flash(error.message, "error")
		);
	}, []);
	const goToLab = (lab) => {
		if (lab._id === auth.lab_id) {
			navigate("/");
			// console.log("labName",selectedLab)
			return;
		}
		UserAPI.adminLab(lab._id).then(
			(user) => {
				setAuth(user);
				window.flash(`Laboratory switched to ${lab.name}`, "success");
				navigate("/");
			},
			(error) => window.flash(error.message, "error")
		);
	};

	const handleEditClick = (lab) => {
		setSelectedLab(lab);
		handleClickOpen();
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const { name, phone, email, suname, semail, spass } = e.target.elements;
		const formData = new FormData();
		formData.append("name", name.value);
		phone.value && formData.append("phone", phone.value);
		email.value && formData.append("email", email.value);
		formData.append("sup_username", suname.value);
		formData.append("sup_email", semail.value);
		formData.append("sup_password", spass.value);

		if (selectedLab) {
			LabAPI.updateLab(selectedLab._id, formData).then(
				(updatedLab) => {
					const updatedLabs = labs.map((lab) =>
						lab._id === selectedLab._id ? updatedLab : lab
					);
					setSelectedLab(null)
					setLabs(updatedLabs);
					handleClose();
				},
				(error) => window.flash(error.message, "error")
			);
		} else {
			LabAPI.createLab(formData).then(
				(newlab) => {
					setLabs([newlab, ...labs]);
					handleClose();

				},
				(error) => window.flash(error.message, "error")
			);
		}
	};

	

	return (
		<div className="container mx-auto">
			<div className="pt-8 pb-2">
				<div className="flex justify-between items-center">
					<PageHeader title='Laboratories' subtitle='Manage laboratories ' />
					<Button
						variant="contained"
						onClick={handleClickOpen}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</div>
			</div>

			<div  >
				<TableContainer component={Paper} sx={{ marginTop: "10px" }}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell align="left">Phone</TableCell>
								<TableCell align="left">Email</TableCell>
								<TableCell align="left">Edit</TableCell>
								<TableCell align="left">Delete</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{labs.map((lab) => (
								<HoverableTableRow
									key={lab._id}
									sx={{
										"&:last-child td, &:last-child th": { border: 0 },
										backgroundColor:
											lab._id === auth.lab_id
												? "lightblue"
												: "transparent",
										cursor:
											lab._id === auth.lab_id
												? "default"
												: "pointer",
									}}
								>
									<TableCell
										component="th"
										scope="row"
										onClick={() => goToLab(lab)}
									>
										{lab.name}
									</TableCell>
									<TableCell align="left">{lab.phone}</TableCell>
									<TableCell align="left">{lab.email}</TableCell>
									<TableCell align="left">
										<Tooltip
											title="Edit"
											placement="right"
											arrow
											enterDelay={500}
											leaveDelay={200}
										>
											<IconButton
												onClick={() => handleEditClick(lab)}
											>
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
										>
											<IconButton>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
								</HoverableTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
			<React.Fragment>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>
						{selectedLab ? "Edit laboratory" : "Create new laboratory"}
					</DialogTitle>
					<DialogContent>
						<Form onSubmit={handleFormSubmit}>
							<Stack spacing={2}>
								<DialogContentText
									sx={{
										color: "crimson",
									}}
								>
									*All fields are required
								</DialogContentText>
								<Stack direction="row" spacing={4}>
									<TextField
										label="Laboratory Name"
										type="text"
										variant="outlined"
										sx={{ width: "900px" }}
										name="name"
										defaultValue={selectedLab ? selectedLab.name : ""}
									/>
								</Stack>

								<Stack direction="row" spacing={2}>
									<TextField
										label="Phone Number"
										type="text"
										variant="outlined"
										sx={{ width: "400px" }}
										name="phone"
										defaultValue={selectedLab ? selectedLab.phone : ""}
									/>
									<TextField
										label="Email Address"
										type="email"
										variant="outlined"
										sx={{ width: "400px" }}
										name="email"
										defaultValue={selectedLab ? selectedLab.email : ""}
									/>
								</Stack>
								<Stack direction="row" spacing={4}>
									<TextField
										label="Supervisor Username"
										type="text"
										variant="outlined"
										sx={{ width: "900px" }}
										name="suname"
										// defaultValue={selectedLab ? selectedLab.sup_username : ""}
										
									/>
								</Stack>
								<Stack direction="row" spacing={2}>
									<TextField
										label="Supervisor Email"
										type="email"
										variant="outlined"
										sx={{ width: "400px" }}
										name="semail"
										defaultValue={selectedLab ? selectedLab.sup_email : ""}
									/>
									<TextField
										label="Supervisor Password	"
										type="password"
										variant="outlined"
										sx={{ width: "400px" }}
										name="spass"
									/>
								</Stack>
								<Stack direction="row" spacing={4}>
									<Button  onClick={handleClose} type="submit">
										{selectedLab ? "Update" : "Save"}
									</Button>
									<Button onClick={handleCancel}>Cancel</Button>
								</Stack>
							</Stack>
						</Form>
					</DialogContent>
				</Dialog>
			</React.Fragment>
		</div>
	);
}
export default AdminLabs;
