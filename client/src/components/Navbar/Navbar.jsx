import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import BiotechIcon from "@mui/icons-material/Biotech";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import useAuth from "../../hooks/useAuth.js";
import { LabAPI } from "../../apis/LabAPI.js";

export const Navbar = () => {
	const [labs, setLabs] = useState([]);
	const [currentLab, setCurrentLab] = useState(null);
	const { auth, setAuth } = useAuth();

	// useEffect(() => {
	// 	LabAPI.getAll().then((labs) => {
	// 		setLabs(labs);
	// 		const lab = labs.find((lab) => lab._id === auth.lab_id);
	// 		setCurrentLab(lab);
	// 	});
	// }, [currentLab]);

	const navigate = useNavigate();
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	// lab
	// const [LabsanchorEl, setLabsAnchorEl] = React.useState(null);
	// const openLabs = Boolean(LabsanchorEl);
	// const handleClickLabs = (event) => {
	// 	setLabsAnchorEl(event.currentTarget);
	// };
	// const handleCloseLabs = () => {
	// 	setLabsAnchorEl(null);
	// };

	// log
	const [LoganchorEl, setLogAnchorEl] = React.useState(null);
	const openLog = Boolean(LoganchorEl);
	const handleClickLog = (event) => {
		setLogAnchorEl(event.currentTarget);
	};
	const handleCloseLog = () => {
		setLogAnchorEl(null);
	};
	// schedule
	const [scheduleAnchorEl, setScheduleAnchorEl] = React.useState(null);
	const openSchedule = Boolean(scheduleAnchorEl);
	const handleClickSchedule = (event) => {
		setScheduleAnchorEl(event.currentTarget);
	};
	const handleCloseSchedule = () => {
		setScheduleAnchorEl(null);
	};
	//users
	const [usersAnchorEl, setUsersAnchorEl] = React.useState(null);
	const openUsers = Boolean(usersAnchorEl);
	const handleClickUsers = (event) => {
		setUsersAnchorEl(event.currentTarget);
	};
	const handleCloseUsers = () => {
		setUsersAnchorEl(null);
	};

	//labs
	const [labAnchorEl, setLabAnchorEl] = React.useState(null);
	const openLab = Boolean(labAnchorEl);
	const handleClickLab = (event) => {
		setLabAnchorEl(event.currentTarget);
	};
	const handleCloseLab = () => {
		setLabAnchorEl(null);
	};
	//Management
	const [manageAnchorEl, setManageAnchorEl] = React.useState(null);
	const openManage = Boolean(manageAnchorEl);
	const handleClickManage = (event) => {
		setManageAnchorEl(event.currentTarget);
	};
	const handleCloseManage = () => {
		setManageAnchorEl(null);
	};
	//Report
	const [reportAnchorEl, setReportAnchorEl] = React.useState(null);
	const openReport = Boolean(reportAnchorEl);
	const handleClickReport = (event) => {
		setReportAnchorEl(event.currentTarget);
	};
	const handleCloseReport = () => {
		setReportAnchorEl(null);
	};
	return (
		<AppBar position="static">
			<Container maxWidth="endregion">
				<Toolbar disableGutters>
					<BiotechIcon
						fontSize="large"
						sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
					/>
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="#app-bar-with-responsive-menu"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						LaMS
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>

						<Menu
							id="lab-basic-menu"
							anchorEl={labAnchorEl}
							open={openLab}
							onClose={handleCloseLab}
							MenuListProps={{
								"aria-labelledby": "manage-basic-button",
							}}
						>
							<MenuItem onClick={handleCloseLab}>
								<Typography onClick={() => navigate("lab/users")}>
									Users Profile
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleCloseLab}>
								<Typography onClick={() => navigate("lab/schedule")}>
									Schedule
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleCloseLab}>
								<Typography onClick={() => navigate("laboratory")}>
									Laboratories
								</Typography>
							</MenuItem>
						</Menu>
						<Menu
							id="log-basic-menu"
							anchorEl={LoganchorEl}
							open={openLog}
							onClose={handleCloseLog}
							MenuListProps={{
								"aria-labelledby": "log-basic-button",
							}}
						>
							<MenuItem onClick={handleCloseLog}>
								<Typography onClick={() => navigate("/log/config")}>
									Config
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleCloseLog}>
								<Typography onClick={() => navigate("/log/logfilling")}>
									Log Filling
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleCloseLog}>
								<Typography onClick={() => navigate("/log/autolog")}>
									Auto Log
								</Typography>
							</MenuItem>
						</Menu>
						<Menu
							id="schedule-basic-menu"
							anchorEl={scheduleAnchorEl}
							open={openSchedule}
							onClose={handleCloseSchedule}
							MenuListProps={{
								"aria-labelledby": "schedule-basic-button",
							}}
						>
							<MenuItem onClick={handleCloseSchedule}>
								<Typography onClick={() => navigate("/schedule/users")}>
									Users
								</Typography>
							</MenuItem>
						</Menu>
						<Menu
							id="manage-basic-menu"
							anchorEl={manageAnchorEl}
							open={openManage}
							onClose={handleCloseManage}
							MenuListProps={{
								"aria-labelledby": "manage-basic-button",
							}}
						>
							<MenuItem onClick={handleCloseManage}>
								<Typography
									onClick={() => navigate("/management/calibration")}
								>
									Calibration
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleCloseManage}>
								<Typography
									onClick={() => navigate("/management/pmservice")}
								>
									PM Service
								</Typography>
							</MenuItem>
						</Menu>
						<Menu
							id="report-basic-menu"
							anchorEl={reportAnchorEl}
							open={openReport}
							onClose={handleCloseReport}
							MenuListProps={{
								"aria-labelledby": "report-basic-button",
							}}
						>
							<MenuItem onClick={handleCloseReport}>
								<Typography
									onClick={() => navigate("/report/surface-report")}
								>
									Surface/Thermometer Report
								</Typography>
							</MenuItem>
						</Menu>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
						>
							<MenuItem onClick={handleClose}>
								<Typography
									onClick={() => navigate("/settings/department")}
								>
									Department
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<Typography
									onClick={() => navigate("/settings/equipment")}
								>
									Equipment
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<Typography
									onClick={() => navigate("/settings/surface")}
								>
									Surface
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<Typography
									onClick={() => navigate("/settings/thermometer")}
								>
									Thermometer
								</Typography>
							</MenuItem>
						</Menu>
					</Box>
					<BiotechIcon
						fontSize="large"
						sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
					/>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="#app-bar-with-responsive-menu"
						sx={{
							mr: 2,
							display: { xs: "flex", md: "none" },
							flexGrow: 1,
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						LOGO
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						<Button
							id="labs-basic-button"
							aria-controls={openLog ? "labs-basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={openLab ? "true" : undefined}
							onClick={handleClickLab}
							sx={{ my: 2, color: "white", display: "block" }}
						>
							Lab
						</Button>

						<Button
							id="log-basic-button"
							aria-controls={openLog ? "log-basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={openLog ? "true" : undefined}
							onClick={handleClickLog}
							sx={{ my: 2, color: "white", display: "block" }}
						>
							Log
						</Button>

						<Button
							id="basic-button"
							aria-controls={open ? "basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
							onClick={handleClick}
							sx={{ my: 2, color: "white", display: "block" }}
						>
							Settings
						</Button>

						<Button
							id="manage-basic-button"
							aria-controls={
								openManage ? "manage-basic-menu" : undefined
							}
							aria-haspopup="true"
							aria-expanded={openManage ? "true" : undefined}
							onClick={handleClickManage}
							sx={{ my: 2, color: "white", display: "block" }}
						>
							Management
						</Button>
						<Button
							id="report-basic-button"
							aria-controls={openReport ? "users-basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={openReport ? "true" : undefined}
							onClick={handleClickReport}
							sx={{ my: 2, color: "white", display: "block" }}
						>
							Reports
						</Button>
					</Box>
					{/* <Box sx={{ flexGrow: 0 }}> */}
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Typography
							variant="h6"
							sx={{
								fontFamily: "initial",
								fontWeight: 700,
								color: "white",
								fontSize: "14px",
								marginRight: "10px",
							}}
						>
							Active : {currentLab ? currentLab.name : "No Selected Lab"}
						</Typography>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar
									alt="Remy Sharp"
									// src="/static/images/avatar/2.jpg"
								/>
							</IconButton>
						</Tooltip>

						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<MenuItem onClick={handleCloseUserMenu}>
								<Typography
									textAlign="center"
									onClick={() => navigate("/adminprofile")}
								>
									Profile
								</Typography>
							</MenuItem>
							{/* <MenuItem onClick={handleCloseUserMenu}>
								<Typography
									textAlign="center"
									onClick={() => navigate("/laboratory")}
								>
									Laboratories
								</Typography>
							</MenuItem> */}
							{/* <MenuItem onClick={handleCloseUserMenu}>
								<Typography textAlign="center">Logout</Typography>
							</MenuItem> */}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
