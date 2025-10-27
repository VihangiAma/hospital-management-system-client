import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};


export default api;
