import {
	Box,
	Button,
	Drawer,
	Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LogTemplateSelection from "../../../components/LogFilling/LogTemplateSelection";
import EquipmentDetails from "../../../components/LogFilling/EquipmentDetails";
import SDEDForm from "../../../components/LogFilling/SDEDForm";
import LogsPagination from "../../../components/LogFilling/logsPagination";
import { GridFilterAltIcon } from "@mui/x-data-grid";
import dayjs from "dayjs";

function LogFilling() {
	const [selectedLogTemp, setSelcectedLogTemp] = useState({});
	const [selectdDateRnge, setSelcectedDateRnge] = useState({
		startDate: dayjs().add(-30, 'day'),
		endDate: dayjs()
	});
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
							setDateRange={setSelcectedDateRnge}
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