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
import { GridCloseIcon, GridFilterListIcon } from "@mui/x-data-grid";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useLocation } from "react-router-dom";
import { DailyLogsStepper } from "../../components/LogFilling/DailyLogsStepper";

export function LogFilling() {

	const { navigatedFromLogsStatus, setNavigatedFromLogsStatus, stepperState, setLogTempFilters, } = useContext(logFillingContext)
	const [isOpen, setIsOpen] = useState(true);
	const navigate = useNavigate();
	// const toggleSidebar = (newOpen) => () => {
	// 	setIsOpen(newOpen);
	// };


	if (navigatedFromLogsStatus) return (

		<>

			<Button
				startIcon={<ArrowBackIosIcon />}
				className={"absolute mb-10 left-8 -top-[60px]"}
				variant="contained"
				onClick={() => { navigate(-1); setNavigatedFromLogsStatus(false) }}
			>
				back to logs status
			</Button>
			<div className=" container pt-4 mt-[160px]  bg-white  mx-auto   px-4  ">

				<div className={"border p-4"} >
					<DailyLogsStepper />
					<Box className={"bg-white mt-4  "}>
						{<LogsPagination />}

					</Box>
				</div>
			</div>
		</>


	);
	return (
		<Box
			className={
				"container pt-4  pb-10  m-auto   px-4 justify-end  relative"
			}
		>
			{/* <div className={"rounded-full mb-4"}>
				<Button
					endIcon={<GridFilterAltIcon />}
					className={" "}
					variant="contained"
					onClick={toggleSidebar(true)}
				>
					Filters
				</Button>

			</div> */}
			<div
				className={` ${isOpen ? 'w-[250px] h-full  px-4 top-0 left-0 pt-2' : 'w-10 top-4 left-4 rounded-md '} mt-[64px]   fixed  flex flex-col items-end  border-r-2 shadow-md`}
				open={isOpen}
			>
				<div onClick={() => setIsOpen(n => !n)} >
					{
						isOpen ? <GridCloseIcon className="w-10 inline-block h-10 " /> :
							<GridFilterListIcon className="w-10 inline-block h-10 "/>
					}
				</div>
				<div className={`${isOpen ? 'block' : 'hidden'} overflow-y-auto py-2`}>
					<LogTempFilters />

				</div>
			</div>
			<Box className={`bg-white mt-10 transition-all  ${isOpen ? 'ml-[250px]' : ''}  `}>
				{<LogsPagination />}

			</Box>
		</Box>
	);
}