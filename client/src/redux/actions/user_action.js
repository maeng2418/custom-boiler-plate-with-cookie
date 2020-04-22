import axios from 'axios';
import { USER_SERVER } from 'components/Config';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    AUTH_USER,
} from './types';

export function loginUser (dataTosubmit) {
    dataTosubmit.remember ? localStorage.setItem('id', dataTosubmit.id) : localStorage.clear('id');
    const request = axios.post(`${USER_SERVER}/login`, dataTosubmit)
    .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    };
}

export function registerUser (dataTosubmit) {
    
    const request = axios.post(`${USER_SERVER}/register`, dataTosubmit)
    .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    };
};

export function logout () {

    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    };
};

export function auth () {

    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    };
};