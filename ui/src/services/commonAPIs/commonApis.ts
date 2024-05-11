// Assume the token and refreshToken are stored in localStorage
import { toast } from 'react-toastify';
import { loginAPi, LogoutApi } from '../constant';
import  getDataFromApi  from '../apiCall';
import { LoginForm } from "@/types/validation";



export const login = async (formData: LoginForm) => {
  let request:any = loginAPi;
  request.data = formData;
  const result:any = await getDataFromApi(request);
  return result?.data;
};


export const logout = async () => {
  try {
    let request:any = LogoutApi;
    const response:any = await getDataFromApi(request); 
    return response.data;
  } catch (error) {    
  }
};


