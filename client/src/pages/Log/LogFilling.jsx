import {
	Box,
	Button,
	Drawer,
	Tooltip,
} from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LogsPagination } from "../../components/LogFilling/LogsPagination";
import { LogTempFilters } from "../../components/LogFilling/LogTempFilters";
import { logFillingContext } from "../../contexts/LogFillingProvider";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useLocation } from "react-router-dom";
import { DailyLogsStepper } from "../../components/LogFilling/DailyLogsStepper";
import { ClosableSidebar } from "../../components/Global/ClosableSidebar";

export function LogFilling() {

	const { navigatedFromLogsStatus, setNavigatedFromLogsStatus, stepperState, setLogTempFilters, } = useContext(logFillingContext)
	const [isOpen, setIsOpen] = useState(true);
	function toggleIsOpen() {
		setIsOpen(n => !n);
	}
	const navigate = useNavigate();



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

			<ClosableSidebar isOpen={isOpen} toggleIsOpen={toggleIsOpen} >
				<LogTempFilters/>
			</ClosableSidebar>
			<Box className={`bg-white mt-14 transition-all   ${isOpen ? 'ml-[250px]' : ''}  `}>
				{<LogsPagination />}

			</Box>
		</Box>
	);
}