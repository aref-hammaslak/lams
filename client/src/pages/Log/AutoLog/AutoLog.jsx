import { useState } from "react";
import dayjs from "dayjs";

function AutoLog() {
	const [eq, setEq] = useState(null);
	const [logTmpl, setLogTmpl] = useState(null);
	const [date, setDate] = useState(dayjs().startOf('year'));

	return (
		<></>
	);
}
export default AutoLog;
