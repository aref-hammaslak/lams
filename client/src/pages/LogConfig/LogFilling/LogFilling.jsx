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
	Drawer,
	Tooltip,
} from "@mui/material";
import { ThermAPI } from "../../../apis/ThermAPI";
import { Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import LogTemplateSelection from "../../../components/LogFilling/LogTemplateSelection";
import EquipmentDetails from "../../../components/LogFilling/EquipmentDetails";
import SDEDForm from "../../../components/LogFilling/SDEDForm";
import LogsPagination from "../../../components/LogFilling/logsPagination";
import { GridFilterAltIcon } from "@mui/x-data-grid";

function LogFilling() {
	const [selectedLogTemp, setSelcectedLogTemp] = useState({});
	const [selectdDateRnge, setSelcectedDateRnge] = useState({});
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = (newOpen) => () => {
		setIsDrawerOpen(newOpen);
	};

	return (
		<Box
			className={
				"container pt-4  shadow-2xl  bg-blue-50 m-auto   px-4 justify-end  relative"
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
				<Box className={"w-[300px] flex p-8 justify-center flex-col  shadow-inner "}>
					<Box className={" w-full "}>
						<LogTemplateSelection
							selectedLogTemp={selectedLogTemp}
							setSelcectedLogTemp={setSelcectedLogTemp}
						/>
					</Box>
					<Box>
						{selectedLogTemp.eq_id && (
							<EquipmentDetails eq_id={selectedLogTemp.eq_id} />
						)}
					</Box>
					<Box>
						<SDEDForm
							dateRange={selectdDateRnge}
							setDateRnge={setSelcectedDateRnge}
						/>
					</Box>
				</Box>
			</Drawer>

			<Box className={"bg-white mt-4"}>
				<LogsPagination />
			</Box>
		</Box>
	);
}
export default LogFilling;