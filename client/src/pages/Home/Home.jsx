import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

import { LabAPI } from "../../apis/LabAPI";
import { UserAPI } from "../../apis/UserAPI.js";

// import useAuth from "../../hooks/useAuth";

const Item = styled(Paper)(({ theme }) => ({
	// backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	// ...theme.typography.body2,
	padding: theme.spacing(4),
	textAlign: "center",
	color: theme.palette.text.secondary,
	backgroundColor: "lightblue",
	fontSize: "20px",
	cursor: "pointer",
}));

function Home() {
	const navigate = useNavigate();
	const [labs, setLabs] = useState([]);
	const [currentLab, setCurrentLab] = useState(null);
	const { auth, setAuth } = useAuth();

	useEffect(() => {
		LabAPI.getAll().then((labs) => {
			setLabs(labs);
			const lab = labs.find((lab) => lab._id === auth.lab_id);
			setCurrentLab(lab);
		}, console.log("homeee", labs));
	}, []);
	return (
		<Box sx={{ flexGrow: 1 }}>
			<Typography variant="h4" gutterBottom sx={{color:"rgba(0, 0, 0, 0.6)", fontSize:"20px",padding:"15px"}}>
				Your workspace is {currentLab ? currentLab.name : ""}
			</Typography>{" "}
			<Grid
				container
				padding={15}
				spacing={{ xs: 2, md: 3 }}
				columns={{ xs: 4, sm: 8, md: 12 }}
			>
				<Grid item xs={2} sm={4} md={4}>
					<Item onClick={() => navigate("/setting/departments")}>
						{" "}
						Department
					</Item>
				</Grid>
				<Grid item xs={2} sm={4} md={4}>
					<Item onClick={() => navigate("/setting/equipments")}>
						Equipment
					</Item>
				</Grid>
				<Grid item xs={2} sm={4} md={4}>
					<Item>
						Reports
					</Item>
				</Grid>
				<Grid item xs={2} sm={4} md={4}>
					<Item onClick={() => navigate("/log/fill")}>
						Log Filling
					</Item>
				</Grid>
				<Grid item xs={2} sm={4} md={4}>
					<Item onClick={() => navigate("/log/auto-fill")}>Auto Log</Item>
				</Grid>
				<Grid item xs={2} sm={4} md={4}>
					<Item onClick={() => navigate("/setting/users")}>
						Users Profile
					</Item>
				</Grid>
			</Grid>
		</Box>
	);
}

export default Home;
