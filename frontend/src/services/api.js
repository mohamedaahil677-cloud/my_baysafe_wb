import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add Authorization header to all requests if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('baysafe_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle expired sessions (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized. Clearing local credentials.");
            localStorage.removeItem('baysafe_token');
            localStorage.removeItem('baysafe_username');
            localStorage.removeItem('baysafe_role');
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    sendOTP: (mobile) => api.post('/auth/send-otp', { mobile }),
    verifyOTP: (mobile, otp) => api.post('/auth/verify-otp', { mobile, otp }),
};

export const dmsService = {
    // Helplines
    getHelplines: () => api.get('/dms/helplines'),
    addHelpline: (data) => api.post('/dms/helplines', data),

    // SafeCamps
    getSafeCamps: () => api.get('/dms/safecamps'),
    addSafeCamp: (data) => api.post('/dms/safecamps', data),

    // Volunteers
    getActiveVolunteers: () => api.get('/dms/volunteers/active'),
    checkIn: (data) => api.post('/dms/volunteer/checkin', data),

    // Uploads
    uploadFile: (formData) => api.post('/dms/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Posts / Social Feed
    getPosts: () => api.get('/dms/posts'),

    // Hazards
    getHazards: (city = '') => api.get(`/dms/hazards shadow_city=${city}`.replace(' shadow_city=', '?city=')),
    reportHazard: (data) => api.post('/dms/hazards', data),

    // Tasks (SOS)
    getTasks: () => api.get('/dms/tasks'),
    createTask: (data) => api.post('/dms/tasks', data),
    updateTask: (taskId, action, extraData = {}) =>
        api.patch(`/dms/tasks/${taskId}`, { action, ...extraData }),
};

export const advancedService = {
    getLiveWeather: (region = 'chennai') => api.get(`/advanced/weather/live?region=${region}`),
    getAllLiveWeather: () => api.get('/advanced/weather/live/all'),
    getThreats: () => api.get('/advanced/threats'),
    getInventory: () => api.get('/advanced/inventory'),
    refillInventory: (id) => api.post(`/advanced/inventory/${id}/refill`),
    getDamageReports: () => api.get('/advanced/damage-reports'),
    submitDamageReport: (data) => api.post('/advanced/damage-reports', data),
    getEvacuationZones: () => api.get('/advanced/evacuation/zones'),
    getEvacuationRoutes: () => api.get('/advanced/evacuation/routes'),
    getMeshNodes: () => api.get('/advanced/mesh/nodes'),
};

export const adminService = {
    // Users
    getUsers: () => api.get('/admin/users'),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    // Volunteers
    getVolunteers: () => api.get('/admin/volunteers'),

    // Cities
    getCities: () => api.get('/admin/cities'),
    createCity: (data) => api.post('/admin/cities', data),
    updateCity: (id, data) => api.put(`/admin/cities/${id}`, data),
    deleteCity: (id) => api.delete(`/admin/cities/${id}`),

    // Weather Records
    getWeatherRecords: () => api.get('/admin/weather-records'),
    createWeatherRecord: (data) => api.post('/admin/weather-records', data),

    // Tasks
    getTasks: () => api.get('/admin/tasks'),
    deleteTask: (id) => api.delete(`/admin/tasks/${id}`),

    // Helplines
    updateHelpline: (id, data) => api.put(`/admin/helplines/${id}`, data),
    deleteHelpline: (id) => api.delete(`/admin/helplines/${id}`),
};

export default api;
