import {
	Box,
	Button,
	Drawer,
	Tooltip,
} from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LogsPagination } from "../../components/LogFilling/LogsPagination";
import { GridFilterAltIcon, unstable_gridTabIndexColumnGroupHeaderSelector } from "@mui/x-data-grid";
import { LogTempFilters } from "../../components/LogFilling/LogTempFilters";
import { logFillingContext } from "../../contexts/LogFillingProvider";
import { GridCloseIcon } from "@mui/x-data-grid";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useLocation } from "react-router-dom";
import { DailyLogsStepper } from "../../components/LogFilling/DailyLogsStepper";

function LogFilling() {

	const { setIsDrawerOpen, isDrawerOpen, loading, navigatedFromDashboard, setNavigatedFromDashboard } = useContext(logFillingContext)
	const navigate = useNavigate();
	const location = useLocation();



	const toggleDrawer = (newOpen) => () => {
		setIsDrawerOpen(newOpen);
	};

	
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
							onClick={() => { navigate(-1); setNavigatedFromDashboard(false) }}
					>
						back to Assignments
					</Button>

					)
				}

			</div>
			{
				navigatedFromDashboard && <DailyLogsStepper/>
			}
			
			<Drawer
				anchor="left"
				className={"p-4 max-w-[200px] "}
				open={isDrawerOpen}
				onClose={toggleDrawer(false)}
			>
				<GridCloseIcon onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 m-2 ml-[260px]"  />
				<LogTempFilters />
			</Drawer>
			<Box className={"bg-white mt-4  "}>
				{<LogsPagination />}

			</Box>
		</Box>


	);
}
export default LogFilling;