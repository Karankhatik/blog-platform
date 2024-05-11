const url = process.env.NEXT_PUBLIC_API_SERVER_URL;

//***************Login API's*******************
export const loginAPI = {
    url: url + 'auth/login',
    method: 'POST',
};

export const logoutApI = {
    url: url + 'auth/logout',
    method: 'GET',
}

export const userSignUp  = {
    url: url + 'users/register',
    method: 'POST',
};

export const verifyOtp = {
    url: url + 'users/verify',
    method: 'POST',
}

export const resendEmailOTPAPI = {
    url: url + 'users/reSendOtp',
    method: 'POST',
}

export const userForgotPassword = {
    url: url + 'users/forgetpassword',
    method: 'POST',
}

export const userResetPassword = {
    url: url + 'users/resetpassword',
    method: 'PATCH',
}

// export const ForgotPassword = {
//     url: url + 'auth/forgotPassword',
//     method: 'POST',
// }

// export const CheckForgotPassword = {
//     url: url + 'auth/checkForgotPassword',
//     method: 'GET',
// }