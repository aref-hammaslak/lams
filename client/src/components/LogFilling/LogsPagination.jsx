/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateLogColumns, generateLogRows } from "./generateLogRowsCols.util";
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import { useGridApiRef } from "@mui/x-data-grid";
import { logFillingContext } from "../../contexts/LogFillingProvider";


const LogsPagination = (props) => {
	const { logTempFilters, displayLogs } = useContext(logFillingContext);

	
	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		if (!displayLogs) return [];
		return generateLogRows(logTempFilters)
	}, [displayLogs, logTempFilters]);

	const columns = useMemo(() => {
		let columnsData = [
			{ label: 'Date', type: 'date' },
			{ label: 'actions', type: 'actions' }
		];

		if(displayLogs) {
			columnsData = [
				columnsData[0],
				...logTempFilters.logTemp.items,
				columnsData[1]
			]
		}
		return generateLogColumns(columnsData, apiRef);
	}, [apiRef, displayLogs, logTempFilters.logTemp?.items])

	const getRowClassName = (params) => {
		const { isLoged, date } = params.row;
		let className = "";
		dayjs.extend(isToday)
		if (dayjs(date).isToday() && !isLoged) className += " bg-orange-300";
		else if (isLoged) {
			className += " bg-green-300";

		} else {
			className += " bg-red-300";
		}

		return className;
	};

	const getCellClassName = (params) => {
		let className = "h-auto overflow-hidden ";
		return className;
	};
	
	return (
		<Grid className={" outline-none h-[75vh] "} item width="inherit">
			<DataGrid
				apiRef={apiRef}
				columns={columns}
				density="standard"
				rows={rows}
				getRowHeight={() => 65}
				className={""}
				disableRowSelectionOnClick
				disableColumnSelector
				getRowClassName={getRowClassName}
				getCellClassName={getCellClassName}
				onCellDoubleClick={
					(_, event) => {
						event.defaultMuiPrevented = true;
					}
				}
				onRowEditStop={(_, event) => {
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
