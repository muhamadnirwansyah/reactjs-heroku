import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:8080";

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

//interceptors
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await instance.get<T>(url, config);
    return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post<T>(url: string, data: any, config?:AxiosRequestConfig): Promise<T> {
    const response = await instance.post<T>(url, data, config);
    return response.data;
}