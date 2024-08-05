import axios from "axios";

const AxiosClient = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_DOMAIN_CLIENT
});

export { AxiosClient }