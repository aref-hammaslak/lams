import { createContext, useEffect, useReducer, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { Outlet } from "react-router-dom";
dayjs.extend(weekday);

const DayContext = createContext({});
DayContext.displayName = 'DayContext';

export class DayMap extends Map {
	constructor(entries) {
		super(entries);
	}

	/**
	 *
	 * @param date {dayjs.Dayjs}
	 */
	get(date) {
		return super.get(date.format('YYYY-MM-DD'))
	}
	/**
	 *
	 * @param date {dayjs.Dayjs}
	 */
	set(date, value) {
		return super.set(date.format('YYYY-MM-DD'), value)
	}
}

function generateDays(date) {
	const days = new DayMap();
	const sm = date.startOf('month');
	const sc = sm.subtract(sm.weekday(), 'day');
	for (let i = 0; i < 42; i++) {
		const day = sc.add(i, 'day');
		days.set(day, { date: day });
	}
	return days;
}

export const DayProvider = ({ date }) => {
	const [days, setDays] = useState(generateDays(dayjs(date)));
	const [currDate, setCurrDate] = useState(dayjs(date));

	useEffect(() => {
		setDays( generateDays(currDate) )
	}, [currDate]);

	const prevMonth = () => {
		setCurrDate( currDate.subtract(1, 'month') );
	}
	const nextMonth = () => {
		setCurrDate( currDate.add(1, 'month') );
	}

	return (
		<DayContext.Provider value={{ days, currDate, setDays, nextMonth, prevMonth }}>
			<Outlet />
		</DayContext.Provider>
	)
}

export default DayContext;