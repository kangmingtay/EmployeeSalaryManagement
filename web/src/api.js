const BASE_URL = process.env.REACT_APP_API || "http://localhost:8888";

export default {
    baseUrl: BASE_URL,
    getEmployeesList: `${BASE_URL}/users`,
    uploadFile: `${BASE_URL}/users/upload`,
}