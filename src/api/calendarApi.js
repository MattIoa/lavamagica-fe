import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL, VITE_API_URL_LOCAL } = getEnvVariables()


const baseURL = window.location.href.includes('localhost') ? VITE_API_URL_LOCAL : VITE_API_URL;


const calendarApi = axios.create({
    baseURL: baseURL
});

// Todo: configurar interceptores
calendarApi.interceptors.request.use( config => {

    config.headers = {
        ...config.headers,
        'x-token':  localStorage.getItem('token')
    }

    return config;
})


export default calendarApi;
