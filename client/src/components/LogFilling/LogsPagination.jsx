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
	const { logTempFilters, displayLogs, equLog, loading, navigatedFromDashboard, } = useContext(logFillingContext);
	const { fetchAllEquLogs, equLogs, fetchLoading, deleteError, deleteLoading, updateLoading, createLoading } = equLog;
	const { _id: temp_id, schedule, startDate, endDate } = logTempFilters?.logTemp ?? {};

	const fecthQueryParams = {
		temp_id,
		sch_id: schedule?._id,
		start_date: startDate,
		end_date: endDate
	}

	useEffect(() => {
		fetchAllEquLogs(fecthQueryParams);
	}, [logTempFilters, navigatedFromDashboard]);

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {

		if (equLogs, logTempFilters.logTemp) return generateLogRows(logTempFilters, equLogs, apiRef);
		return [];
	}, [equLogs, deleteError]);

	const columns = useMemo(() => {
		let columnsData = [
			{ label: 'Date', type: 'date' },
			{ label: 'actions', type: 'actions' }
		];
		if (!logTempFilters.logTemp) {
			// if (!displayLogs) return [];
			return columnsData;
		}
		columnsData = [
			columnsData[0],
			...logTempFilters.logTemp.items,
			columnsData[1]
		]

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
		<Grid className={`outline-none ${navigatedFromDashboard ? '': 'max-h-[75vh]'}  ` } item width="inherit">
			<DataGrid
				apiRef={apiRef}
				columns={columns}
				density="standard"
				loading={fetchLoading || deleteLoading || createLoading || updateLoading || loading}
				emptyRowsMessage={loading ? "Loading..." : "No Logs found"}


				slotProps={{
					loadingOverlay: {
						variant: 'linear-progress',
						noRowsVariant: 'skeleton',
					},
					noRowsOverlay: {
						children: fetchLoading ? <sapn>Loading...</sapn> : <span>
							No log found
						</span>
					}



				}}
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
					sorting: {
						sortModel: [{ field: "date", sort: "desc" }],
					},
				}}
				hideFooter={navigatedFromDashboard}
			/>
		</Grid>

	);
};

export { LogsPagination };
