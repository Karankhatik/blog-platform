export const url = "http://localhost:8000/api/v1/";

//***************Login API's*******************
export const login = {
    url: url + 'auth/login',
    method: 'POST',
};

export const Logout = {
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