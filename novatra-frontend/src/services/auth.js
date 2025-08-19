import api from "./api";
export const loginApi = (data) => api.post("/users/login", data);
export const registerApi = (data) => api.post("/users/register", data);
export const me = () => api.get("/users/me");
