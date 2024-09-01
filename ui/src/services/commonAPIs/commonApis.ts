import { loginAPI, logoutApI, sendEmail } from '../constant';
import  getDataFromApi  from '../apiCall';
import { LoginForm } from "@/types/validation";



export const login = async (formData: LoginForm) => {
  let request:any = loginAPI;
  request.data = formData;
  const result:any = await getDataFromApi(request);
  return result?.data;
};


export const logout = async () => {
  try {
    let request:any = logoutApI;
    const response:any = await getDataFromApi(request); 
    return response.data;
  } catch (error) {    
  }
};

export const sendEmailAPI = async( name: string, message:string) => {

  try {
    let request:any = sendEmail;
    request.data = {name: name, message: message};
    const response:any = await getDataFromApi(request);
    return response.data;
  } catch (error) {
    console.log(error);
  }

}


