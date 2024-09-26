import { api } from "./configs/axiosConfig.js";

export const MessageAPI = {

    async getAll(params = {}) {
        try {
            const response = await api.request({
                url: '/messages',
                method: 'GET',
                params,
            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError();
        }
    },
    async getUnreadCount() {
        try {
            const response = await api.get('/messages/user/unReadCount')
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    },
    async createMessage(message) {
        try {
            const response = await api.request({
                url: '/messages',
                method: 'POST',
                data: message
            });
            this.handleResponse(response)
        } catch (error) {
            this.handleError(error)
        }
    },
    async MarkMessageAsRead(messageId) {
        try {
            const response = await api.request({
                url: `/messages/${messageId}/read`,
                method: 'PUT',
            });
            this.handleResponse(response);
        } catch (error) {
            this.handleError(error)
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
            throw new Error(error.response.data.error._message || error.response.data.error.message || 'API request failed');
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error(error.message);
        }
    }
}