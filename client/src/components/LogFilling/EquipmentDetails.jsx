import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { Stack } from "react-bootstrap";
import { EquAPI } from "../../apis/EquAPI";

// eslint-disable-next-line react/prop-types
const EquipmentDetails = ({ eq_id }) => {

	const [equipment, setEquipment] = useState({});
	useEffect(() => {
		async function fetchData() {
			try {
				const equipment = await EquAPI.get(eq_id);
				setEquipment(equipment);
			} catch (error) {
				console.log(error);
			}
		}

		fetchData();

	}, [eq_id]);

	return (
		<>
			{equipment && eq_id && (
				<Box className={" flex flex-col  justify-center font mt-4 "}>

						<Stack className="flex-1 bg-white rounded ">
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
						<Stack className="flex-1 bg-white rounded">
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
			)}
		</>
	);
};

export default EquipmentDetails;
