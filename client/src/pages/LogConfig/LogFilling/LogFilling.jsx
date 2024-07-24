import {
	Box,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	FormControlLabel,
	Button,
	Stack,
	Grid,
	Breadcrumbs,
	TextField,
	Typography,
	Checkbox,
} from "@mui/material";
import { ThermAPI } from "../../../apis/ThermAPI";
import { Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

const rows1 = [
	Array.from({ length: 30 }, (_, i) => `T`),
	Array.from({ length: 30 }, () => (
		<Checkbox size="small" sx={{ padding: 0 }} />
	)),
	Array.from({ length: 30 }, (_, i) => `SR`),
];

const DataTable = ({ rows }) => (
	<TableContainer component={Paper}>
		<Table
			sx={{ minWidth: 650, border: 1, borderColor: "grey.300" }}
			aria-label="simple table"
		>
			<TableHead>
				<TableRow>
					<TableCell sx={{ border: 1, borderColor: "grey.300" }}>
						{" "}
						Daily Log
					</TableCell>
					{Array.from({ length: 30 }, (_, i) => (
						<TableCell
							key={i}
							align="right"
							x={{ border: 1, borderColor: "grey.300" }}
						>
							{i + 1}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row, rowIndex) => (
					<TableRow key={rowIndex}>
						<TableCell
							align="left"
							sx={{ border: 1, borderColor: "grey.300" }}
						>
							Remove Paraffine
						</TableCell>
						{row.map((cell, cellIndex) => (
							<TableCell
								key={cellIndex}
								align="right"
								sx={{ border: 1, borderColor: "grey.300" }}
							>
								{cell}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);

//2

const rows2 = [
	Array.from({ length: 4 }, (_, i) => `T`),
	Array.from({ length: 4 }, () => (
		<Checkbox size="small" sx={{ padding: 0 }} />
	)),
	Array.from({ length: 4 }, (_, i) => `SR`),
];

const DataTable2 = ({ rowsTwo }) => (
	<TableContainer component={Paper}>
		<Table
			sx={{ minWidth: 650, border: 1, borderColor: "grey.300" }}
			aria-label="simple table"
		>
			<TableHead>
				<TableRow>
					<TableCell sx={{ border: 1, borderColor: "grey.300" }}>
						{" "}
						Weekly Log
					</TableCell>
					{Array.from({ length: 4 }, (_, i) => (
						<TableCell
							key={i}
							align="right"
							x={{ border: 1, borderColor: "grey.300" }}
						>
							{i + 1}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rowsTwo.map((row, rowIndex) => (
					<TableRow key={rowIndex}>
						<TableCell
							align="left"
							sx={{ border: 1, borderColor: "grey.300" }}
						>
							Wash The Floating Dish
						</TableCell>
						{row.map((cell, cellIndex) => (
							<TableCell
								key={cellIndex}
								align="right"
								sx={{ border: 1, borderColor: "grey.300" }}
							>
								{cell}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);

//3
const rows3 = [
	Array.from({ length: 12 }, (_, i) => `T`),
	Array.from({ length: 12 }, () => (
		<Checkbox size="small" sx={{ padding: 0 }} />
	)),
	Array.from({ length: 12 }, (_, i) => `SR`),
];

const DataTable3 = ({ rowsThree }) => (
	<TableContainer component={Paper}>
		<Table
			sx={{ minWidth: 650, border: 1, borderColor: "grey.300" }}
			aria-label="simple table"
		>
			<TableHead>
				<TableRow>
					<TableCell sx={{ border: 1, borderColor: "grey.300" }}>
						{" "}
						Monthly Log
					</TableCell>
					{Array.from({ length: 12 }, (_, i) => (
						<TableCell
							key={i}
							align="right"
							x={{ border: 1, borderColor: "grey.300" }}
						>
							{i + 1}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rowsThree.map((row, rowIndex) => (
					<TableRow key={rowIndex}>
						<TableCell
							align="left"
							sx={{ border: 1, borderColor: "grey.300" }}
						>
							Wash The Floating Dish
						</TableCell>
						{row.map((cell, cellIndex) => (
							<TableCell
								key={cellIndex}
								align="right"
								sx={{ border: 1, borderColor: "grey.300" }}
							>
								{cell}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);
//4
const rows4 = [
	Array.from({ length: 12 }, (_, i) => `T`),
	Array.from({ length: 12 }, () => (
		<Checkbox size="small" sx={{ padding: 0 }} />
	)),
	Array.from({ length: 12 }, (_, i) => `SR`),
];

const DataTable4 = ({ rowsFour }) => (
	<TableContainer component={Paper}>
		<Table
			sx={{ minWidth: 650, border: 1, borderColor: "grey.300" }}
			aria-label="simple table"
		>
			<TableHead>
				<TableRow>
					<TableCell sx={{ border: 1, borderColor: "grey.300" }}>
						{" "}
						Quarterly Log
					</TableCell>
					{Array.from({ length: 12 }, (_, i) => (
						<TableCell
							key={i}
							align="right"
							x={{ border: 1, borderColor: "grey.300" }}
						>
							{i + 1}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rowsFour.map((row, rowIndex) => (
					<TableRow key={rowIndex}>
						<TableCell
							align="left"
							sx={{ border: 1, borderColor: "grey.300" }}
						>
							Staff
						</TableCell>
						{row.map((cell, cellIndex) => (
							<TableCell
								key={cellIndex}
								align="right"
								sx={{ border: 1, borderColor: "grey.300" }}
							>
								{cell}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);
//5
const rows5 = [
	Array.from({ length: 12 }, (_, i) => `T`),
	Array.from({ length: 12 }, () => (
		<Checkbox size="small" sx={{ padding: 0 }} />
	)),
	Array.from({ length: 12 }, (_, i) => `SR`),
];

const DataTable5 = ({ rowsFive }) => (
	<TableContainer component={Paper}>
		<Table
			sx={{ minWidth: 650, border: 1, borderColor: "grey.300" }}
			aria-label="simple table"
		>
			<TableHead>
				<TableRow>
					<TableCell sx={{ border: 1, borderColor: "grey.300" }}>
						{" "}
						Semi Annually Log
					</TableCell>
					{Array.from({ length: 12 }, (_, i) => (
						<TableCell
							key={i}
							align="right"
							x={{ border: 1, borderColor: "grey.300" }}
						>
							{i + 1}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rowsFive.map((row, rowIndex) => (
					<TableRow key={rowIndex}>
						<TableCell
							align="left"
							sx={{ border: 1, borderColor: "grey.300" }}
						>
							Staff
						</TableCell>
						{row.map((cell, cellIndex) => (
							<TableCell
								key={cellIndex}
								align="right"
								sx={{ border: 1, borderColor: "grey.300" }}
							>
								{cell}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);
//6
const rows6 = [
	Array.from({ length: 12 }, (_, i) => `T`),
	Array.from({ length: 12 }, () => (
		<Checkbox size="small" sx={{ padding: 0 }} />
	)),
	Array.from({ length: 12 }, (_, i) => `SR`),
];

const DataTable6 = ({ rowsSix }) => (
	<TableContainer component={Paper}>
		<Table
			sx={{ minWidth: 650, border: 1, borderColor: "grey.300" }}
			aria-label="simple table"
		>
			<TableHead>
				<TableRow>
					<TableCell sx={{ border: 1, borderColor: "grey.300" }}>
						{" "}
						Annually Log
					</TableCell>
					{Array.from({ length: 12 }, (_, i) => (
						<TableCell
							key={i}
							align="right"
							x={{ border: 1, borderColor: "grey.300" }}
						>
							{i + 1}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rowsSix.map((row, rowIndex) => (
					<TableRow key={rowIndex}>
						<TableCell
							align="left"
							sx={{ border: 1, borderColor: "grey.300" }}
						>
							Remove Paraffine
						</TableCell>
						{row.map((cell, cellIndex) => (
							<TableCell
								key={cellIndex}
								align="right"
								sx={{ border: 1, borderColor: "grey.300" }}
							>
								{cell}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);

function LogFilling() {
	const [deps, setDeps] = useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const { value: name } = e.target.elements.name;
		ThermAPI.create(name).then(
			(dep) => setDeps([dep, ...deps]),
			(error) => window.flash(error.message, "error")
		);
	};
	return (
		<Box
			sx={{
				width: "96%",
				minHeight: "300px",
				backgroundColor: "rgba(194, 160, 178, 0.2)",
				margin: "auto",
				justifyContent: "space-between",
				alignItems: "center",
				marginTop: 2,
				border: "1px solid #ddd",
				borderRadius: 2,
			}}
		>
			<Box
				sx={{
					width: "96%",
					height: "60px",
					backgroundColor: "white",
					margin: "auto",
					justifyContent: "space-between",
					alignItems: "center",
					marginTop: 2,
					border: "1px solid #ddd",
					borderRadius: 2,
				}}
			>
				{" "}
				<form onSubmit={handleSubmit}>
					<Stack spacing={3} direction="row">
						<TextField
							label="Name"
							name="name"
							variant="outlined"
							sx={{ width: "400px" }}
						/>
						<Button type="submit" variant="contained" color="primary">
							Save
						</Button>
					</Stack>
				</form>
			</Box>
			<Box
				sx={{
					padding: 2,

					maxWidth: "99%",
					margin: "0 auto ",
				}}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} display={"flex"} alignItems="center">
						<Typography
							variant="body1"
							component="div"
							sx={{ marginRight: 20, marginLeft: 30 }}
						>
							Name: WaterBath
						</Typography>
						<Typography
							variant="body1"
							component="div"
							sx={{ marginRight: 20 }}
						>
							Manufacture: BOEKEL
						</Typography>
						<Typography variant="body1" component="div">
							Model Number: 145807
						</Typography>
					</Grid>
					<Grid item xs={12} display={"flex"} alignItems="center">
						<Typography
							variant="body1"
							component="div"
							sx={{ marginRight: 20, marginLeft: 30 }}
						>
							Serial :101821778
						</Typography>
						<Typography variant="body1" component="div">
							Location: Histology
						</Typography>
					</Grid>
				</Grid>
			</Box>
			<Divider sx={{ maxWidth: "99%", margin: "auto" }} />
			<Box sx={{ maxWidth: "99%", margin: "0 auto", marginTop: 0.75 }}>
				<DataTable rows={rows1} />
			</Box>
			<Box sx={{ maxWidth: "99%", margin: "0 auto", marginTop: 0.75 }}>
				<DataTable2 rowsTwo={rows2} />
			</Box>
			<Box sx={{ maxWidth: "99%", margin: "0 auto", marginTop: 0.75 }}>
				<DataTable3 rowsThree={rows3} />
			</Box>
			<Box sx={{ maxWidth: "99%", margin: "0 auto", marginTop: 0.75 }}>
				<DataTable4 rowsFour={rows4} />
			</Box>
			<Box sx={{ maxWidth: "99%", margin: "0 auto", marginTop: 0.75 }}>
				<DataTable5 rowsFive={rows5} />
			</Box>
			<Box
				sx={{
					maxWidth: "99%",
					margin: "0 auto",
					marginTop: 0.75,
					marginBottom: 0.75,
				}}
			>
				<DataTable6 rowsSix={rows6} />
			</Box>
		</Box>
	);
}
export default LogFilling;
