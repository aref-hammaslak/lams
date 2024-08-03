/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateLogColumns, generateLogRows } from "./generateLogRowsCols.util";
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import { useGridApiContext, useGridApiRef } from "@mui/x-data-grid";


const LogsPagination = (props) => {
	// const {  dateRange, logTemp } = props;
	const apiRef = useGridApiRef();
	const logTemp = {
		_id: "655dc8d8178611fdfea48d35",
		eq_id: "65226da58f9bc630f7755105",
		type: 0,
		items: [
			{
				label: "check ground",
				type: 0,
				_id: "655dc8d8178611fdfea48d36",
			},
			{
				label: "clean pipes",
				type: 1,
				_id: "655dc8d8178611fdfea48d37",
			},
			{
				label: "count pipes",
				type: 2,
			},
			{
				label: "options",
				type: 3,
			}
		],
		__v: 0,
		eq_details: {
			lab_id: "651962bfb8197a97c9c59d5c",
			name: "Tissue Processor",
		},
		schedule: {
			_id: "6575e1d34da7584444520944",
			initial_date: "2023-12-15T00:00:00.000Z",
			end_date: "2028-01-01T00:00:00.000Z",
			type: "equipment",
			recurrence: "annually",
		},
	};
	const dateRange = {
		sartDate: new Date("2024-06-27"),
		endDate: new Date(),
	};
	const logRows = generateLogRows(
		dateRange.sartDate,
		dateRange.endDate,
		"Daily",
		logTemp
	);



	const getRowClassName = (params) => {
		const { isLoged, date } = params.row;
		let className = "";



		dayjs.extend(isToday)
		if (dayjs(date).isToday() && !isLoged) className += " bg-orange-300";
		else if (isLoged) {
			className += " bg-green-300"; // Change the background color to gray for even rows

		} else {
			className += " bg-red-300";
		}


		return className;
	};

	const getCellClassName = (params) => {
		let className = "h-auto overflow-hidden ";
		return className;
	};

	const columnsData = [
		{ label: 'Date', type: 'date' },
		...logTemp.items,
		{ label: 'actions', type: 'actions' }
	];
	const columns = generateLogColumns(columnsData, apiRef);

	return (

		<Grid className={" outline-none h-[75vh] "} item width="inherit">
			<DataGrid
				apiRef={apiRef}
				columns={columns}
				density="standard"
				rows={logRows}
				getRowHeight={() => 65}
				className={""}
				disableRowSelectionOnClick
				disableColumnSelector
				getRowClassName={getRowClassName}
				getCellClassName={getCellClassName}
				onCellDoubleClick={
					(params, event) => {
						event.defaultMuiPrevented = true;
					}
				}
				onRowEditStop={(params, event) => {
					event.defaultMuiPrevented = true;
				}}

				editMode="row"
				sortingOrder={['desc', 'asc']}
				initialState={{
					pagination: {
						paginationModel: { pageSize: 25 },
					},
				}}
			/>
		</Grid>

	);
};

export default LogsPagination;
