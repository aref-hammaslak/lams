import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

export const SurfAPI = {
	get: async function (surface_id, cancel = false) {
		const response = await api.request({
			url: `/surface/${surface_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (cancel = false) {
		const response = await api.request({
			url: "/surface/",
			method: "GET",
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	create: async function (data, cancel = false) {
		const response = await api.request({
			url: "/surface",
			method: "POST",
			data,
			signal: cancel
				? cancelApiObject[this.create.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	},
	update: async function (surface_id, data, cancel = false) {
		const response = await api.request({
			url: `/surface/${surface_id}`,
			method: "PATCH",
			data,
			signal: cancel
				? cancelApiObject[this.update.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	},
	destroy: async function (surface_id, cancel = false) {
		const response = await api.request({
			url: `/surface/${surface_id}`,
			method: "DELETE",
			signal: cancel
				? cancelApiObject[this.destroy.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	}
};
const cancelApiObject = defineCancelApiObject(SurfAPI);
