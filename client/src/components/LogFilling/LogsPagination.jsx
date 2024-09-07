/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateLogColumns, generateLogRows } from "./generateLogRowsCols.util";
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import { useGridApiRef } from "@mui/x-data-grid";
import { logFillingContext } from "../../contexts/LogFillingProvider";
import InfoIcon from '@mui/icons-material/Info';

const LogsPagination = (props) => {
	const { logTempFilters, displayLogs, equLog, loading, navigatedFromLogsStatus, logSchedules } = useContext(logFillingContext);
	const { fetchAllEquLogs, equLogs, fetchLoading, deleteError, deleteLoading, updateLoading, createLoading } = equLog;
	const { _id: temp_id, schedule, startDate, endDate } = logTempFilters?.logTemp ?? {};

	const fecthQueryParams = {
		temp_id,
		start_date: startDate,
		end_date: endDate
	}

	useEffect(() => {
		fetchAllEquLogs(fecthQueryParams);
	}, [logTempFilters, navigatedFromLogsStatus]);

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {

		if (equLogs, logTempFilters.logTemp) return generateLogRows(logTempFilters, equLogs, apiRef, logSchedules, navigatedFromLogsStatus ? false : true);
		return [];
	}, [equLogs, deleteError]);

	const columns = useMemo(() => {
		let columnsData = [
			{ label: 'Date', type: 'date' },
			{ label: 'actions', type: 'actions' }
		];
		if (!logTempFilters?.logTemp) {
			// if (!displayLogs) return [];
			return columnsData;
		}
		columnsData = [
			columnsData[0],
			...logTempFilters.logTemp.items,
			columnsData[1]
		]

		return generateLogColumns(columnsData, apiRef);
	}, [apiRef, displayLogs, logTempFilters?.logTemp?.items])

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
		<Grid className={`outline-none  bg-white relative `} item width="inherit">
			{
				rows.length ? (
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
						className={`${!navigatedFromLogsStatus && 'min-h-[75vh]'} px-4 pb-8 rounded-lg shadow`}
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
						hideFooter={navigatedFromLogsStatus || rows.length < 26}
					/>
				) : (
						<div className=" font-semibold text-lg left-1/2 top-[calc(70vh/2)] -translate-x-1/2 -translate-y-1/2 border p-20 rounded-lg  absolute flex items-center justify-center bg-white shadow ">
							<p className="space-x-1 flex items-center ">
								<InfoIcon className="text-red-500 " />
								<sapn>
									No Log Found
								</sapn>
							</p>
						</div>
			)}


		</Grid>

	);
};

export { LogsPagination };
