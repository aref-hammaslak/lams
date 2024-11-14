import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

function objectToFormData(obj) {
	const formData = new FormData();
  
	Object.entries(obj).forEach(([key, value]) => {
		if (key === "roles" || key === "deleteFiles") {
			console.log(value)
			value = JSON.stringify(value)
			console.log(value)
		}
		formData.append(key, value);
	});
  
	return formData;
  }

export const UserAPI = {
	login: async function (username, password, cancel = false) {
		const response = await api.request({
			url: `/users/login`,
			method: "POST",
			data: { username, password },
			signal: cancel
				? cancelApiObject[this.login.name].handleRequestCancellation().signal
				: undefined,
		})

		return response.data.payload;
	},
	logout: async function (cancel = false) {
		const response = await api.request({
			url: `/users/logout`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.logout.name].handleRequestCancellation().signal
				: undefined,
		})

		return response.data.payload;
	},
	getSelf: async function (cancel = false) {
		const response = await api.request({
			url: `/users/self`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.getSelf.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload;
	},
	get: async function (user_id,params={}, cancel = false) {
		const response = await api.request({
			url: `/users/${user_id}`,
			method: "GET",
			params,
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (q = undefined, select, includeAbsenceStatus=false,date=undefined, cancel = false) {
		const response = await api.request({
			url: "/users/",
			method: "GET",
			params: { q, select, includeAbsenceStatus, date},
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	toggleUser: async function (user_id, cancel = false) {
		const response = await api.request({
			url: `/users/toggle/${user_id}`,
			method: "PATCH",
			signal: cancel
				? cancelApiObject[this.toggleUser.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	updateUser: async function (user_id, updates, params={}, cancel = false) {
		const response = await api.request({
			url: `/users/${user_id}`,
			method: "PATCH",
			data: updates,
			params,
			signal: cancel
				? cancelApiObject[this.updateUser.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	createUser: async function (name, username, email, password, cancel = false) {
		const response = await api.request({
			url: "/users",
			method: "POST",
			data: { name, username, email, password },
			signal: cancel
				? cancelApiObject[this.createUser.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	deleteUser: async function (user_id, cancel = false) {
		const respons = await api.request({
			url: `/users/${user_id}`,
			method: "DELETE",
			signal: cancel
				? cancelApiObject[this.deleteUser.name].handleRequestCancellation().signal
				: undefined,
		});
	},
	adminLab: async function (lab_id, cancel = false) {
		const response = await api.request({
			url: `/users/admin/${lab_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.adminLabs.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	}
};
const cancelApiObject = defineCancelApiObject(UserAPI);
