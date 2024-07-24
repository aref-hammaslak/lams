import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

export const DocAPI = {
	get: async function (doc_id, cancel = false) {
		const response = await api.request({
			url: `/upload/${doc_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
    upload: async function (name, file, cancel = false) {
        const formData = new FormData();
        formData.append(name, file);
        const response = await api.request({
            url: "/upload",
            method: "POST",
			data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
			signal: cancel
				? cancelApiObject[this.createDoc.name].handleRequestCancellation().signal
				: undefined,
        })
		return response.data.payload[0]
    },
};
const cancelApiObject = defineCancelApiObject(DocAPI);
