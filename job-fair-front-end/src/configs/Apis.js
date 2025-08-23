import axios from "axios";
import cookie from 'react-cookies';

const BASE_URL = 'http://localhost:8080/';

export const endpoints = {
  register: "/api/auth/register",
  login: "/api/auth/login",
  refresh: "/api/auth/refresh",
};

export const authApis = () => axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${cookie.load('token')}`
  }
});

export default axios.create({
  baseURL: BASE_URL
});
