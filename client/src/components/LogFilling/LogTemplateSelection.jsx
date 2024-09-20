/* eslint-disable react/prop-types */


// extracts all the equipment names from the log templates

import React, { useContext, useState } from "react";
import { MenuItem, FormControl, Select, InputLabel, Box } from "@mui/material";
import PropTypes from "prop-types";
import { reccurencs } from "../../consts";
import { logFillingContext } from "../../contexts/LogFillingProvider";
import useLogTemp from "../../hooks/useLogTemp";
import { Loading } from "../Global/Loading";

function LogTemplateSelection() {
	const { logTempFilters, setLogTempFilters } = useContext(logFillingContext);
	const { equipments,  recurrenceTypeCodes, updateSetDefaults, loading  } = useLogTemp(logTempFilters, setLogTempFilters);

	return (
		<>
  
			<div className={"flex gap-4  justify-center  flex-col !relative"}>
				{             
					loading && <Loading/>          
				}  
      
				<FormControl className={" bg-white "}>
					<InputLabel id="">Equipment</InputLabel>       

					<Select

						value={logTempFilters.equipment ?? ''}

						label="Equipment"
						onChange={(e) => {
							const equipment = e.target.value;

							updateSetDefaults({ type: 1, value: equipment });
						}}
					>
						{equipments.map((eq, index) => (
							<MenuItem key={index} value={eq}>
								{eq}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl className={" bg-white "}>
					<InputLabel >Type</InputLabel>
					<Select
						value={logTempFilters.reccurence ?? ''}
						label="Type"
						onChange={(e) => {
							updateSetDefaults({ type: 2, value: e.target.value });
						}}
					>
						{recurrenceTypeCodes?.map((reccTypeCode, index) => (
							<MenuItem key={index} value={reccTypeCode}>
								{reccurencs[reccTypeCode]}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

		</>

	);
}

LogTemplateSelection.proptypes = {
	logTempFilters: {
		equipment: PropTypes.string,
		reccurence: PropTypes.number,
		logTemp: PropTypes.object,
	},
	setLogTempFilters: PropTypes.func,
};

export default LogTemplateSelection;
