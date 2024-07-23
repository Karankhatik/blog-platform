import getDataFromApi from '../apiCall';
import { userSignUp, verifyOtp, deleteUser, updateUser,  resendEmailOTPAPI, getAllUsers, userForgotPassword, userResetPassword } from '../constant';
import { RegistrationForm, } from '@/types/validation';

export const registerUser = async (formData: RegistrationForm) => {
    let request: any = userSignUp;
    request.data = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
    };
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const verifyEmail = async (email: string, otp: Number) => {
        let request: any = verifyOtp;
        request.data = {email: email, otp: otp};
        const result: any = await getDataFromApi(request);
        return result?.data;
};

export const resendEmailOTP = async (email: string) => {
    let request: any = resendEmailOTPAPI;
    request.data = {email: email};
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const forgotPassword = async (email:string) => {
    let request: any = userForgotPassword;
    request.data = {email: email};
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const resetPassword = async (otp: number, newPassword: string, email: string) => {
    let request: any = userResetPassword;
    request.data = {otp: otp, newPassword : newPassword, email: email};
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const getAllTheUsers = async (page: number, limit: number, email?: string) => {
    // Create a copy of the request object to avoid mutating the original one
    let request: any = { ...getAllUsers };
    if(email) {
        request.url = `${getAllUsers.url}?page=${page}&limit=${limit}&email=${email}`;
    } else {
        request.url = `${getAllUsers.url}?page=${page}&limit=${limit}`;
    }  
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const deleteUserByAdmin = async (id: string) => {
    let request: any = { ...deleteUser };
    request.url = `${deleteUser.url}/${id}`;
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const updateUserByAdmin = async (id: string, data: any) => {
    let request: any = { ...updateUser };
    request.url = `${updateUser.url}/${id}`;
    request.data = data;
    const result: any = await getDataFromApi(request);
    return result?.data;
};







