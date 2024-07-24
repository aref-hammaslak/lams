import { useContext, useEffect, useReducer, useState } from "react";
import DayContext, { DayMap } from "../contexts/DayProvider.jsx";
import { ScheduleAPI } from "../apis/ScheduleAPI.js";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
dayjs(weekday);
// import useDay from "./useDay.js";

const ITEM_RECURRENCE = [
	'weekly',
	'monthly',
	'quarterly',
	'semiannually',
	'annually'
]

const scheduleReducer = (state, action) => {
	const { days } = state;
	switch (action.type) {
		case 'loading':
			Object.keys(days).forEach(key => {
				days[key].schedules = [];
				days[key].loading = true;
			});
			return {
				...state,
				days
			}
		case 'refresh':
			const { schedules, items } = action;
			Object.keys(days).forEach(key => {
				days[key].schedules = schedules[key + "T00:00:00.000Z"] || [];
				days[key].loading = false;
			});
			return {
				...state,
				days,
				items
			}
		case 'prev_month':
			const prevMonth = state.date.subtract(1, 'month');
			return {
				...state,
				date: prevMonth,
				days: generateDays(prevMonth)
			}
		case 'next_month':
			const nextMonth = state.date.add(1, 'month');
			return {
				...state,
				date: nextMonth,
				days: generateDays(nextMonth)
			}
		case 'change_date':
			const newDate = action.date.startOf('month');
			return {
				...state,
				date: newDate,
				days: generateDays(newDate)
			}
		case 'select_day':
			return {
				...state,
				selectedDay: action.day
			}
		case 'expand_day':
			return {
				...state,
				expandedDay: action.day
			}
		case 'select_schedule':
			return {
				...state,
				selectedSchedule: action.schedule
			}
		case 'start_edit':
			const { item } = action;
			return {
				...state,
				edit: true,
				item,
			}
		case 'change_type':
			return {
				...state,
				itemType: action.itemType
			}
		case 'end_edit':
			return {
				...state,
				edit: false,
				item: undefined,
			}
		case 'toggle_task':
			return {
				...state,
				selectedTasks: state.selectedTasks.find()
			}
	}
}

function generateDays(date) {
	const days = {};
	const sm = date.startOf('month');
	const sc = sm.subtract(sm.weekday(), 'day');
	for (let i = 0; i < 42; i++) {
		const day = sc.add(i, 'day');
		const key = day.format('YYYY-MM-DD');
		days[key] = { date: day, schedules: [] };
		days[key].mute = day.month() !== date.month()
	}
	return days;
}

const useSchedule = ({ itemType = null, initialState } = {}) => {
	const date = initialState?.date || dayjs()
	const [state, dispatch] = useReducer(scheduleReducer, {
		date,
		days: generateDays(date),
		itemType
	});

	const [refreshToggle, setRefreshToggle] = useState(false);
	const refresh = () => setRefreshToggle(!refreshToggle);
	const daysArray = () => Object.keys(state.days);

	useEffect(() => {
		dispatch({ type: 'loading' });
		ScheduleAPI.getAll(
			undefined,
			daysArray().at(0),
			daysArray().at(-1),
			itemType === 'all' ? null : (itemType || state.itemType),
			true,
			'date'
		).then(
			({ schedule: schedules, items }) => {
				console.log('schedules', schedules);
				dispatch({ type: 'refresh', schedules, items })
			},
		);
	}, [state.itemType, state.date, refreshToggle]);


	const changeScheduleType = (itemType) => {
		if (itemType === 'all') itemType = null;
		dispatch({ type: 'change_type', itemType})
	}

	return {
		...state,
		daysArray,
		refresh,
		changeScheduleType,
		startEdit: async (item) => {
			const sch = await ScheduleAPI.get(item._id)
			dispatch({ type: 'start_edit', item: {...sch, ...item} })
			dispatch({ type: 'select_day', day: dayjs(item.date)})
		},
		selectDay: (day) => dispatch({ type: 'select_day', day }),
		expandDay: (day) => dispatch({ type: 'expand_day', day }),
		endEdit: () => dispatch({ type: 'end_edit' }),
		selectSchedule: (schedule) => dispatch({ type: 'select_schedule', schedule}),
		handleAdd: async (day) => {
			console.log('adding schedule');
			if (!state.edit) return;
			const { item } = state;
			await ScheduleAPI.create(
				type, item._id,
				day.format('YYYY-MM-DD'),
				ITEM_RECURRENCE[item.recurrence]
			);
			await refresh();
		},
		handleDelete: async (schedule) => {
			if (!state.edit) return;
			await ScheduleAPI.destroy(schedule._id);
		},
		prevMonth: async () => {
			dispatch({ type: 'prev_month' });
		},
		nextMonth: async () => {
			dispatch({ type: 'next_month' });
		},
		changeDate: async (date) => {
			dispatch({ type: 'change_date', date })
		},
		toggleTask: (task) => {
			dispatch({ type: 'toggle_task', task });
		}
	}
}

export default useSchedule;