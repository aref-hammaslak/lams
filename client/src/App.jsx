import "./App.css";
import { RootLayout } from "./layouts/RootLayout";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login";
import AdminLabs from "./pages/AdminLabs/AdminLabs";
import AdminProfile from "./pages/AdminProfile/AdminProfile";
import Equipment from "./pages/LabManagement/Equipment";
import Department from "./pages/Setting/Department";
import LogConfig from "./pages/LogConfig";
import RequireAuth from "./components/RequireAuth";
import { Route, Routes } from "react-router-dom";
import Surface from "./pages/LabManagement/Surface";
import Thermometer from "./pages/LabManagement/Termometer";
import Calibration from "./pages/Management/Calibration/Calibration";
import PMService from "./pages/Management/PMService/PMService";
import Reports from "./pages/Reports/Reports";
import { LogFilling } from "./pages/Log/LogFilling.jsx";
import { AutoLog } from "./pages/Log/AutoLog.jsx";
import { Calendar } from "./components/Calendar";
import UserProfile from "./pages/UserProfile/UserProfile";
import Users from "./pages/Users";
import Unauthorized from "./pages/LabManagement/Unauthorized/Unauthorized.jsx";
import { ROLES } from "./consts/index.js"
import {
	LogsStatus

} from "./pages/Log/LogsStatus.jsx";
import { LogFillingProvider } from "./contexts/LogFillingProvider.jsx";
import { DayProvider } from "./contexts/DayProvider.jsx";
import { ScheduleDefine } from "./pages/Schedule/ScheduleDefine.jsx";
import { ScheduleAssign } from "./pages/Schedule/ScheduleAssign.jsx";
import { Profile } from "./pages/Users/Profile.jsx";
function App() {

	return (
		<>
			<Routes>
				{/** All rolse has access */}
				<Route element={<RequireAuth allowedRolse={[ROLES.staff]} />}>


					<Route path="/" element={<RootLayout />}>
						<Route path="" element={<Home />} />
						<Route path="profile" element={<Profile />} />

						{/** Only addmin has access */}
						<Route element={<RequireAuth allowedRolse={[ROLES.admin]} />}>
							<Route path="laboratories" element={<AdminLabs />} />
						</Route>

						{/** Admin and supervisor have access */}
						<Route element={<RequireAuth allowedRolse={[ROLES.supervisor]}/>}>
							<Route path="setting">
								<Route path="users/*" element={<Users />} />
								<Route path="log-configs" element={<LogConfig />} />
								<Route path="equipments" element={<Equipment />} />
								<Route path="departments" element={<Department />} />
								<Route path="surfaces" element={<Surface />} />
								<Route path="thermometers" element={<Thermometer />} />
							</Route>
							<Route path="schedule">
								<Route path="define" element={<ScheduleDefine />} />
								<Route path="assign" element={<ScheduleAssign />} />
							</Route>
						</Route>

						<Route path="log" element={<LogFillingProvider><DayProvider></DayProvider></LogFillingProvider>}>
							<Route path="status" element={<LogsStatus />} />
							<Route path="fill" element={<LogFilling />} />
							<Route element={<RequireAuth allowedRolse={[ROLES.supervisor]}/>}> 
								<Route path="auto-fill" element={<AutoLog />} />
							</Route>
						</Route>

					</Route>
				</Route>


				{/* PUBLIC ROUTES */}
				<Route path="/login" element={<Login />} />
				{/* <Route path="*" element={<NotFound />} /> */}
				<Route path="/unauthorized" element={<Unauthorized />} />
			</Routes>
		</>
	);
}

export default App;
