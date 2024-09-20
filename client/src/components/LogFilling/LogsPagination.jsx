/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateLogColumns, generateLogRows } from "./generateLogRowsCols.util";
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import { useGridApiRef } from "@mui/x-data-grid";
import { logFillingContext } from "../../contexts/LogFillingProvider";
import InfoIcon from '@mui/icons-material/Info';
import { Loading } from "../Global/Loading";
import { ScheduleAPI } from "../../apis/ScheduleAPI";

const LogsPagination = ({ minHight, navigatedFromLogsStatus = false, disableColumnMenu=false, disableColumnSorting=false }) => {
	const { logTempFilters, equLog, } = useContext(logFillingContext);
	const { fetchAllEquLogs, equLogs, loading } = equLog;
	const { _id: temp_id } = logTempFilters?.logTemp ?? '' ;
	const [schedules, setSchedules] = useState([]);

	const fecthQueryParams = {
		temp_id,
		start_date: dayjs(logTempFilters?.startDate).format('YYYY-MM-DD'),
		end_date: dayjs(logTempFilters?.endDate).add(1, 'day').format('YYYY-MM-DD')
	}

	useEffect(() => {
		fetchAllEquLogs(fecthQueryParams);
	}, [ logTempFilters]);

	useEffect(() => {
		(async () => {
			const schedules = await ScheduleAPI.getAll(temp_id, null, null, 'equipment', false, null, null, true)
			setSchedules(schedules);
		})()
	},[temp_id])

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
	

		if (equLogs, logTempFilters.logTemp) return generateLogRows(logTempFilters, equLogs, apiRef, schedules, !navigatedFromLogsStatus);
		return [];
	}, [equLogs]);

	const columns = useMemo(() => {
		let columnsData = [
			{field:'date', label: 'Date', type: 'date'},
			{ label: 'actions', type: 'actions', }
		];
		if (!logTempFilters?.logTemp) {
			return [];
		}
		columnsData = [
			columnsData[0],
			...logTempFilters.logTemp.items,
			columnsData[1]
		]

		return generateLogColumns(columnsData, apiRef);
	}, [logTempFilters])
	console.log("🚀 ~ rows ~ rows:", rows)

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
	const CustomNoRows = () => {
		return (
				<div className="flex items-center justify-center w-full h-full  ">
					{
						(
						<p className="space-x-1 flex items-center  font-semibold text-lg text-gray-700  ">
								<InfoIcon className="text-red-500 " />
								<sapn>
									No Scheduled Log Found
								</sapn>
							</p>
						)
					}

				</div>
		)
	}
	return (
		<>
			{
				loading && <Loading className='!fixed !m-0'/>
			}
			<Grid className={`outline-none  bg-white relative `} item width="inherit">
				{
					// rows.length || loading ?
						(
							<DataGrid
								apiRef={apiRef}
								columns={ columns}
								density="standard"
								rows={rows}
								getRowHeight={() => 65}
							className={`${minHight && 'min-h-[75vh]'} ${!rows.length  && minHight && 'h-[60vh]'}  overflow-auto px-4 pb-8 rounded-lg shadow `}
								
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
							slots={{
								noRowsOverlay: CustomNoRows
								
								}}
								initialState={{
									pagination: {
										paginationModel: { pageSize: 25 },
									},
									sorting: {
										sortModel: [{ field: "date", sort: "desc" }],
									},
								}}
								disableColumnMenu={disableColumnMenu}
								disableColumnSorting={disableColumnSorting}
								hideFooter={navigatedFromLogsStatus || rows.length < 26}
							/>
						) 
						// :
						// (
						// 	<div className=" font-semibold text-lg left-1/2 top-[calc(70vh/2)] -translate-x-1/2 -translate-y-1/2 border p-20 rounded-lg  absolute flex items-center justify-center w-[360px] h-[200px] bg-white shadow ">
						// 		{
						// 				(
						// 					<p className="space-x-1 flex items-center ">
						// 						<InfoIcon className="text-red-500 " />
						// 						<sapn>
						// 							No Log Found
						// 						</sapn>
						// 					</p>
						// 				)
						// 		}

						// 	</div>
						// )
				}

			</Grid>
		</>


	);
};

export { LogsPagination };
