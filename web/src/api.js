const BASE_URL = process.env.REACT_APP_API || "http://localhost:8888";

export default {
    baseUrl: BASE_URL,
    getEmployee: (id) => `${BASE_URL}/users/${id}`,
    deleteEmployee: (id) => `${BASE_URL}/users/${id}`,
    updateEmployee: (id) => `${BASE_URL}/users/${id}`,
    createEmployee: (id) => `${BASE_URL}/users/${id}`,
    getEmployeesList: `${BASE_URL}/users`,
    uploadFile: `${BASE_URL}/users/upload`,
}