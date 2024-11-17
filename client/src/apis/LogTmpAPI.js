import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

export const LogTmpAPI = {
	get: async function (log_id, cancel = false) {
		const response = await api.request({
			url: `/logTemplate/${log_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (eq_id, cancel = false) {
		const response = await api.request({
			url: "/logTemplate/",
			method: "GET",
			params: { eq_id },
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAllScheduled:async function ( cancel = false) {
		const response = await api.request({
			url: `/logTemplate?scheduled=true&group=ture`,
			method: "GET",
			
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	create: async function (name, cancel = false) {
		const response = await api.request({
			url: "/logTemplate",
			method: "POST",
			data: { name },
			signal: cancel
				? cancelApiObject[this.createLab.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	},
	destroy: async function (id, cancel = false) {
		const response = await api.request({
			url: `/logTemplate/${id}`,
			method: "DELETE",
			signal: cancel
				? cancelApiObject[this.destroy.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	update: async function (id, data, cancel = false) {
		const response = await api.request({
			url: `/logTemplate/${id}`,
			method: "PATCH",
			data,
			signal: cancel
				? cancelApiObject[this.update.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	}
};
const cancelApiObject = defineCancelApiObject(LogTmpAPI);
