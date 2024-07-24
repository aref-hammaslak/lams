import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

export const EquAPI = {
	get: async function (equ_id, cancel = false) {
		const response = await api.request({
			url: `/equipment/${equ_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (cancel = false) {
		const response = await api.request({
			url: "/equipment/",
			method: "GET",
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
    createEqu: async function (data, cancel = false) {
        const response = await api.request({
            url: "/equipment",
            method: "POST",
			data,
			signal: cancel
				? cancelApiObject[this.createEqu.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    },
    updateEqu: async function (equ_id, data, cancel = false) {
        const response = await api.request({
            url: `/equipment/${equ_id}`,
            method: "PATCH",
			data,
			signal: cancel
				? cancelApiObject[this.updateEqu.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    },
    deleteEqu: async function (equ_id, cancel = false) {
        const response = await api.request({
            url: `/equipment/${equ_id}`,
            method: "DELETE",
			signal: cancel
				? cancelApiObject[this.deleteEqu.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    }
};
const cancelApiObject = defineCancelApiObject(EquAPI);