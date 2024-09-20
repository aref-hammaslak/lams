import {
	Box,
} from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LogsPagination } from "../../components/LogFilling/LogsPagination";
import { LogTempFilters } from "../../components/LogFilling/LogTempFilters";
import { ClosableSidebar } from "../../components/Global/ClosableSidebar";
import PageHeader from "../../components/Global/PageHeader";

export function LogFilling() {
	const [isOpen, setIsOpen] = useState(true);
	function toggleIsOpen() {
		setIsOpen(n => !n);
	}
	return (
		<Box
			className={
				" bg-gray-50 w-full  min-h-screen   justify-end  relative"
			}
		>
			<ClosableSidebar isOpen={isOpen} toggleIsOpen={toggleIsOpen} >
				<LogTempFilters/>
			</ClosableSidebar>
			<Box className={`pt-12 pb-20 relative  px-10 transition-all space-y-4   ${isOpen ? 'ml-[250px]' : ''}  `}>
				<PageHeader title='Equipment Logs' subtitle='Track view and manage equipment usage and maintenance logs' />
				<LogsPagination minHight={true} />
			</Box>
		</Box>
	);
}