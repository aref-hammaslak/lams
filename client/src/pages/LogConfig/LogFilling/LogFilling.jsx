import {
	Box,
	Button,
	Drawer,
	Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LogsPagination from "../../../components/LogFilling/LogsPagination";
import { GridFilterAltIcon } from "@mui/x-data-grid";
import LogTempFilters from "../../../components/LogFilling/LogTempFilters";

function LogFilling() {
	const [logTempFilters, setLogTempFilters] = useState({});
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [displayLogs, setDisplayLogs] = useState(false);

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
				<Tooltip title={"filters"}>
					<Button
						endIcon={<GridFilterAltIcon />}
						className={" "}
						variant="contained"
						onClick={toggleDrawer(true)}
					>
						Filters
					</Button>
				</Tooltip>
			</div>
			<Drawer
				anchor="right"
				className={"p-4 max-w-[200px] "}
				open={isDrawerOpen}
				onClose={toggleDrawer(false)}
			>
				<LogTempFilters logTempFilters={logTempFilters}
					setLogTempFilters={setLogTempFilters} setDisplayLogs={setDisplayLogs} />
			</Drawer>
			<Box className={"bg-white mt-4  "}>
				<LogsPagination displayLogs={displayLogs} logTempFilters={logTempFilters} />
			</Box>
		</Box>
	);
}
export default LogFilling;