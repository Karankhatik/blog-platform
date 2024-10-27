import axios from 'axios';
import { toast } from "react-toastify";

const url = "https://intake-learn.onrender.com/api/v1/";

const axios_instance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axios_instance.interceptors.request.use(config => {
  config.headers["access-token"] = localStorage.getItem('acessToken');
  return config;
});

const refresh_token = async () => {  
  console.log("hre it is coming?");
  console.log("acc", localStorage.getItem('acessToken'))
  return await axios.post(`${url}auth/refreshToken`, { acessToken: localStorage.getItem('acessToken') }, {
    withCredentials: true,
  });
}



let refreshing_token: any = null;

axios_instance.interceptors.response.use(response => {
  return response;
}, async error => {
  const config = error.config;
  if (error.response && error.response.status === 401 && error?.response?.data?.message === 'jwt expired' && !config._retry) {
    config._retry = true;
    try {      
      refreshing_token = refreshing_token ? refreshing_token : refresh_token();
      let res = await refreshing_token;
      refreshing_token = null;
      return axios_instance(config);
    } catch (err) {
      return Promise.reject(err)
    }
  }
  return Promise.reject(error)
});

const getDataFromApi = async (request: any) => {
  try {
    const response: any = await axios_instance(request);
    if (response.status === 200 || response.status === 201 || response?.code === 200 || response.code === 201) {
      if(response?.data?.accessToken) {
        localStorage.setItem('acessToken' , response?.data?.accessToken);
      }      
      return { data: response.data, flag: true };    
    }
  } catch (err: any) {
    let errMessage = err?.response?.data?.message;
    let messages = ['Refresh token expired', 'Invalid Access Token', 'Refresh token expired or used', 'Invalid refresh token','invalid signature', 'invalid token', 'jwt malformed', 'Not authorized to access this route.', 'Jwt expired', 'Unauthorized', 'User may not exist.', 'Session expired'];
    if (messages.includes(errMessage)) {
      localStorage.clear();
      window.location.href = "/auth/login";
      window.location.reload();
    } else {
      toast.error(errMessage);
      return { flag: false, error: err.response };
    }
  }
};

export default getDataFromApi;
