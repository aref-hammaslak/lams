import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { Stack } from "react-bootstrap";
import { EquAPI } from "../../apis/EquAPI";

// eslint-disable-next-line react/prop-types
const EquipmentDetails = ({ eq_id }) => {
	// const Equipment = {
	// 	_id: "651ea1c4628043ae3224028a",
	// 	lab_id: "651962bfb8197a97c9c59d5c",
	// 	dep_id: "656c2eaeb616ff122bcc1c0b",
	// 	name: "WaterBath",
	// 	model_no: "34284",
	// 	manufacture: "SinaComp",
	// 	rsc_name: "SinaSupport",
	// 	rsc_phone: "43739472",
	// 	__v: 0,
	// 	serial: "875934",
	// };
	const [equipment, setEquipment] = useState({});
	useEffect(() => {
		async function fetchData() {
			try {
				const equipment = await EquAPI.get(eq_id);
				console.log(equipment);
				setEquipment(equipment);
			} catch (error) {
				console.log(error);
			}
		}

		fetchData();

	}, [eq_id]);

	return (
		<>
			{equipment && (
				<Box className={" flex w-full  justify-center font "}>
					<Box
						className={
							"flex flex-col justify-center sm:flex-row sm:justify-between sm:w-full py-4 overflow-y-auto bg-white w-[300px]    "
						}
					>
						<Stack className="flex-1 px-4 bg-white rounded ">
							{[
								["Equipment Name", equipment.name],
								["Manufacture", equipment.manufacture],
								["Model Nomber", equipment.model_no],
							].map(([lable, value], index) => {
								return (
									<div key={index} className={""}>
										<span className="mr-2 text-sm contrast-50">
											{lable}:
										</span>
										<span>{value}</span>
									</div>
								);
							})}
						</Stack>
						<Stack className="flex-1 px-4 bg-white border-l rounded">
							{[
								["RSC Name", equipment.rsc_name],
								["RSC Phone Number", equipment.rsc_phone],
								["Serial Number", equipment.serial],
							].map(([lable, value], index) => {
								return (
									<div key={index}>
										<span className="mr-2 text-sm contrast-50">
											{lable}:
										</span>
										<span>{value}</span>
									</div>
								);
							})}
						</Stack>
					</Box>
				</Box>
			)}
		</>
	);
};

export default EquipmentDetails;
