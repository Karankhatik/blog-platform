import getDataFromApi from '../apiCall';
import { userSignUp, verifyOtp, resendEmailOTPAPI, userForgotPassword, userResetPassword } from '../constant';
import { RegistrationForm, LoginForm, PasswordResetForm } from '@/types/validation';

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
    request.data = {otp: otp, newPassword : newPassword, email};
    const result: any = await getDataFromApi(request);
    return result?.data;
};





