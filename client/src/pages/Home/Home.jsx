import * as React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import { LabsOverview } from "../../components/Home/LabsOverview.jsx";
import { LabStaffOverview } from "../../components/Home/LabStaffOverview.jsx";
import { Button } from "@material-tailwind/react";
import { UserAPI } from "../../apis/UserAPI.js";
import { useSnackbar } from 'notistack';
import { useGetUserRole } from "../../hooks/useGetUserRole.js";
import { LabAPI } from "../../apis/LabAPI.js";
import { LogsStatus } from "../Log/LogsStatus.jsx";
import { DayProvider } from "../../contexts/DayProvider.jsx";
import { Calendar } from "../../components/Calendar/assignmentsCalendar/Clalendar.jsx";
import PageHeader from "../../components/Global/PageHeader.jsx";


function Home() {
	const { auth, setAuth } = useAuth();
	const [currenLab, setCurrentLab] = useState({});
	const role = useGetUserRole();

	const [showLabDetails, setShowLabDetails] = useState(() => {
		return role === 'admin' ? false : true;
	});

	useEffect(() => {
		(async () => {
			let curlab = {};
			try {
				curlab = await LabAPI.get(auth.lab_id);
			} catch (error) {
				console.error(error);
			}
			setCurrentLab(curlab);
		})()

	}, [auth])

	const { enqueueSnackbar } = useSnackbar();

	const handelLabChange = (labId, labName) => {
		setCurrentLab({
			_id: labId,
			name: labName
		});
		setShowLabDetails(true);
		if (labId === auth.lab_id) return;
		UserAPI.adminLab(labId).then(
			(user) => {
				setAuth(user);
				enqueueSnackbar(`Your worksapce changed to ${labName}`, { variant: 'info' })
			},
			(error) => window.flash(error.message, "error")
		);
	}


	if (role === 'staff') {
		return (
			
				<div className='p-8 space-y-4'>
					<PageHeader title='Home' subtitle='Home page' />
				</div>
		)
	}

	return (
		<div className="container mx-auto py-8 ">
			<div className="mb-4 space-y-1 grid grid-cols-12">
				<h1 className="text-2xl font-bold text-black col-span-2">
					{
						showLabDetails ? `${currenLab.name} Lab` : 'Labs'
					}
				</h1>
				<Button size="sm" onClick={() => setShowLabDetails(false)} className={`${(!showLabDetails || role !== 'admin') && 'hidden'} !mt-0 bg-primaryDark`}>back</Button>
				<p className="text-gray-700 text-sm col-span-12">
					{showLabDetails ? 'Staff ' : 'Labs '}
					overview with their recent activity
				</p>

			</div>

			{
				showLabDetails ? (
					<>
						{currenLab._id && <LabStaffOverview lab={currenLab} />}
					</>
				) : (
					<LabsOverview onLabChange={handelLabChange} />
				)
			}
		</div>
	)
}

export default Home;
