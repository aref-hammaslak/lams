import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

export const DepAPI = {
	get: async function (dep_id, cancel = false) {
		const response = await api.request({
			url: `/department/${dep_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (cancel = false) {
		const response = await api.request({
			url: "/department/",
			method: "GET",
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
    createDep: async function (name, cancel = false) {
        const response = await api.request({
            url: "/department",
            method: "POST",
			data: { name },
			signal: cancel
				? cancelApiObject[this.createDep.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    },
    updateDep: async function (dep_id, name, active, cancel = false) {
        const response = await api.request({
            url: `/department/${dep_id}`,
            method: "PATCH",
			data: { name, active },
			signal: cancel
				? cancelApiObject[this.updateDep.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    },
    deleteDep: async function (dep_id, cancel = false) {
        const response = await api.request({
            url: `/department/${dep_id}`,
            method: "DELETE",
			signal: cancel
				? cancelApiObject[this.deleteDep.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    }
};
const cancelApiObject = defineCancelApiObject(DepAPI);
