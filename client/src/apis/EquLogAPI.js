import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";


const EquLogAPI = {


    async fetchAll(cancel = false, params ={}) {
        try {
            const response = await api.request({
                url: '/log/equipment',
                method: 'GET',
                params,
                signal: cancel
                    ? cancelApiObject[this.updateEqu.name].handleRequestCancellation().signal
                    : undefined,

            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    },

    async afetchById (id, cancel = false){
        try {
            const response = await api.request({
                url: `/log/equipment/${id}`,
                method: '',
                signal: cancel
                    ? cancelApiObject[this.updateEqu.name].handleRequestCancellation().signal
                    : undefined,

            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        } 
    },

    async create(data, cancel = false) {
        try {
            const response = await api.request({
                url: '/log/equipment',
                data,
                method: 'POST',
                signal: cancel
                    ? cancelApiObject[this.updateEqu.name].handleRequestCancellation().signal
                    : undefined,

            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    },

  async update(id, data, cancel = false) {
        try {
            const response = await api.request({
                url: '/log/equipment',
                method: 'PATCH',
                signal: cancel
                    ? cancelApiObject[this.updateEqu.name].handleRequestCancellation().signal
                    : undefined,

            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    },

  async delete(id, cancel = false) {
        try {
            const response = await api.request({
                url: `/log/equipment/${id}`,
                method: 'DELETE',
                signal: cancel
                    ? cancelApiObject[this.updateEqu.name].handleRequestCancellation().signal
                    : undefined,

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
            throw new Error('API request failed');
        }
    },

  handleError(error) {
        if (error.response) {
            console.error('Server responded with an error:', error.response.data);
            throw new Error(error.response.data.payload || 'API request failed');
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error(error.message);
        }
    }
}
const cancelApiObject = defineCancelApiObject(EquLogAPI);
export default EquLogAPI;
