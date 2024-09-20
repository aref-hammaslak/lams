import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

export const ScheduleAPI = {
	get: async function (sch_id, cancel = false) {
		const response = await api.request({
			url: `/schedule/${sch_id}`,
			method: "GET",
			// params: {
			// 	'start-date': start_date,
			// 	'end-date': end_date
			// },
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (item, start_date, end_date, type, expand, groupBy, recurrence,raw, cancel = false) {
		const response = await api.request({
			url: "/schedule/",
			method: "GET",
			params: {
				item,
				recurrence,
				'start-date': start_date,
				'end-date': end_date,
				type,
				'expand-item': expand,
				'group-by': groupBy,
				raw
			},
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	create: async function (item_type, item_id, initial_date, end_date, recurrence, cancel = false) {
		const response = await api.request({
			url: `/schedule/${item_type}/${item_id}`,
			method: "POST",
			data: { initial_date, end_date, recurrence },
			signal: cancel
				? cancelApiObject[this.create.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	},
	update: async function (schedule_id, data, cancel = false) {
		const response = await api.request({
			url: `/schedule/${schedule_id}`,
			method: "PATCH",
			data,
			signal: cancel
				? cancelApiObject[this.update.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	},
	destroy: async function (schedule_id, cancel = false) {
		const response = await api.request({
			url: `/schedule/${schedule_id}`,
			method: "DELETE",
			signal: cancel
				? cancelApiObject[this.destroy.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	},
	getMaps: async function (start_date, end_date, expand, group_by, cancel = false) {
		const response = await api.request({
			url: 'schedule-map',
			method: "GET",
			params: {
				'start-date': start_date,
				'end-date': end_date,
				expand,
				'group-by': group_by
			},
			signal: cancel
				? cancelApiObject[this.getMaps.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload;
	},
	createMap: async function (date, user_id, sch_ids, cancel = false) {
		const response = await api.request({
			url: 'schedule-map',
			method: "POST",
			params: { bulk: true },
			data: { date, user_id, sch_ids },
			signal: cancel
				? cancelApiObject[this.createMap.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload;
	},
	destroyMap: async function (sch_map_id, cancel = false) {
		const response = await api.request({
			url: `schedule-map/${sch_map_id}`,
			method: "DELETE",
			signal: cancel
				? cancelApiObject[this.destroyMap.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload;
	}

};
const cancelApiObject = defineCancelApiObject(ScheduleAPI);
