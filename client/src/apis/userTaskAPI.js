import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils.js";


const userTaskAPI = {

    // params : lab_id, startDate, endDate
    async fetchAllInLab(params = {}, cancel = false) {
        try {
            const response = await api.request({
                url: '/users/task',
                method: 'GET',
                params,

            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    },

    async fetchById(id,params, cancel = false) {
        try {
            const response = await api.request({
                url: `/users/task/${id}`,
                method: 'GET',
                params
            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    },
    handleResponse(response) {
        if (response.data.success) {
            return response.data.payload;
        } else {
            throw new Error(response.message);
        }
    },

    handleError(error) {
        if (error.response) {
            console.error('Server responded with an error:', error.response.data);
            throw new Error(error.response.data.error._message || 'API request failed');
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received');
        } else {
            console.error(error)
            // console.error('Error setting up request:', error.message);
            // throw new Error(error.message);
        }
    }

}
const cancelApiObject = defineCancelApiObject(userTaskAPI);
export {userTaskAPI}