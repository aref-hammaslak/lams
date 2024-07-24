import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

export const LabAPI = {
	get: async function (lab_id, cancel = false) {
		const response = await api.request({
			url: `/laboratory/${lab_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (cancel = false) {
		const response = await api.request({
			url: "/laboratory/",
			method: "GET",
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation()
						.signal
				: undefined,
		});
		return response.data.payload;
	},
	createLab: async function (formData, cancel = false) {
        const response = await api.request({
            url: "/laboratory",
            method: "POST",
			data: formData,
			headers: {"Content-Type": "multipart/form-data"},
			signal: cancel
				? cancelApiObject[this.createLab.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    },
    updateLab: async function (lab_id, formData, cancel = false) {
        const response = await api.request({
            url: `/laboratory/${lab_id}`,
            method: "PATCH",
			data: formData,
			headers: {"Content-Type": "multipart/form-data"},
			signal: cancel
				? cancelApiObject[this.updateLab.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload
    }
};
const cancelApiObject = defineCancelApiObject(LabAPI);
