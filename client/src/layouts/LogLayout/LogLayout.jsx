import {Outlet} from "react-router-dom";
import { Breadcrumbs, Link } from "@mui/material";

export const LogLayout = () => {
	return (
		<>
			<Breadcrumbs>
				<Link underline='hover' color='inherit' href='/log'>
					Logs
				</Link>
				<Link underline='hover' color='inherit' href='/log/config'>
					Config
				</Link>
			</Breadcrumbs>
			<Outlet />
		</>
	);
}
