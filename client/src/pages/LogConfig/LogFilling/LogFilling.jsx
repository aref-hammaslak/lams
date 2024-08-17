import {
	Box,
	Button,
	Drawer,
	Tooltip,
} from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import LogsPagination from "../../../components/LogFilling/LogsPagination";
import { GridFilterAltIcon } from "@mui/x-data-grid";
import LogTempFilters from "../../../components/LogFilling/LogTempFilters";
import LogFillingProvider from "../../../contexts/LogFillingProvider";
import { logFillingContext } from "../../../contexts/LogFillingProvider";
import { GridCloseIcon } from "@mui/x-data-grid";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";

function LogFilling() {

	const { setIsDrawerOpen, isDrawerOpen, loading, navigatedFromDashboard, setNavigatedFromDashboard } = useContext(logFillingContext)
	const navigate = useNavigate();



	const toggleDrawer = (newOpen) => () => {
		setIsDrawerOpen(newOpen);
	};

	useEffect(() => {
		return () => {
			// if (navigatedFromDashboard) setNavigatedFromDashboard(false);
		};
	}, []);


	return (

		<Box
			className={
				"container pt-4  pb-10  m-auto   px-4 justify-end  relative"
			}
		>
			<div className={"rounded-full mb-4"}>
				{
					!navigatedFromDashboard ? (<Button
						endIcon={<GridFilterAltIcon />}
						className={" "}
						variant="contained"
						onClick={toggleDrawer(true)}
					>
						Filters
					</Button>) : (<Button
						startIcon={<ArrowBackIosIcon />}
						className={" "}
						variant="contained"
						onClick={() => navigate('/')}
					>
						back to dashboard
					</Button>

					)
				}

			</div>
			<Drawer
				anchor="right"
				className={"p-4 max-w-[200px] "}
				open={isDrawerOpen}
				onClose={toggleDrawer(false)}
			>
				<GridCloseIcon onClick={() => setIsDrawerOpen(false)} sx={{ width: 30, height: 30, m: 1 }} />
				<LogTempFilters />
			</Drawer>
			<Box className={"bg-white mt-4  "}>
				{<LogsPagination />}

			</Box>
		</Box>


	);
}
export default LogFilling;