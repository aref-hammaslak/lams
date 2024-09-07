import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { ClosableSidebar } from "../../components/Global/ClosableSidebar.jsx";
import { AutoLogFilters } from "../../components/LogFilling/AutoLogFilters.jsx";
import { useSnackbar } from 'notistack'
import { api } from "../../apis/configs/axiosConfig.js";
import { DataGrid } from "@mui/x-data-grid";
import InfoIcon from '@mui/icons-material/Info';


export function AutoLog() {


	const [isOpen, setIsOpen] = useState(true);
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const [filledLogs, setFilledLogs] = useState(null);

	function toggleIsOpen() {
		setIsOpen(n => !n);
	}

	async function handlelAutoFill(logtemp, date) {
		console.log('logtemp, date :', logtemp, date);
		setFilledLogs(null);
		try {
			setLoading(true);
			const response = await api.request({
				url: `/log/equipment/auto-fill/${logtemp._id}`,
				method: 'GET',
				params: {
					start_date: dayjs(date).startOf('month').format('YYYY-MM-DD'),
					end_date: dayjs(date).endOf('month').format('YYYY-MM-DD')
				}
			})
			console.log(response);
			if (response.data.success) {
				const { payload: logs } = response.data;
				if (logs?.length > 0) {
					setFilledLogs(logs);
					enqueueSnackbar(`${logs.length} empty logs filled successfully`, {
						variant: 'success'
					})
				} else {
					enqueueSnackbar(`All the logs are already filld for this equipment`, {
						variant: 'info'
					})
				}
			}
			else {
				throw new Error(response.data.error.message);
			}
		} catch (error) {
			enqueueSnackbar(error.message, { variant: 'error' });
			setLoading(false);
		} finally {
			setLoading(false);
		}

	}

	const gridRows = useMemo(() => {
		if (!filledLogs || filledLogs?.length === 0) return;
		return filledLogs.map((log, i) => {
			return {
				id: i,
				date: dayjs(log.date).format('YYYY-MM-DD'),
				...log.items,
				
			}
		})
	}, [filledLogs]);
	const gridColumns = useMemo(() => {
		
		if (!filledLogs || filledLogs?.length === 0) return;

		const cols = Object.keys(gridRows[0]).filter(key => key !== 'id').map(key => {
			return {
				field: key,
				headerName: key.at(0).toUpperCase() + key.slice(1),
				// flex: 1
				minWidth:200
			}
		})

		return cols;
	}, [filledLogs])
	console.log("🚀 ~ gridColumns ~ gridColumns:", gridColumns)

	return (
		<div className="w-full ">
			{/* header */}
			<ClosableSidebar isOpen={isOpen} toggleIsOpen={toggleIsOpen}>
				<AutoLogFilters loading={loading} handlelAutoFill={handlelAutoFill} />
			</ClosableSidebar>
			{/* body */}
			<div className={`${isOpen ? 'ml-[250px]': ''}`}>
				<div className={`py-16 px-10  ${isOpen ? 'w-[calc(100vw-254px)]' : ''} overflow-hidden m-auto bg-gray-50 min-h-[calc(100vh-64px)] relative`}>
					{
						filledLogs ? (<DataGrid
							columns={gridColumns}
							rows={gridRows}
							className="bg-white overflow-x-auto"
							
						/>) : (
							<div className=" font-semibold text-lg left-1/2 top-[calc(85vh/2)] -translate-x-1/2 -translate-y-1/2 border p-20 rounded-lg  absolute flex items-center justify-center bg-white shadow ">
								<p className="space-x-1 flex items-center ">
									<InfoIcon className="text-red-500 " />
									<sapn>
										No Log Found
									</sapn>
								</p>
							</div>
						)
					}

				</div>
			</div>
		</div>
	);
}

