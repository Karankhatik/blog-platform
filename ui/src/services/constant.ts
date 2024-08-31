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
    url: url + 'users/resetPassword',
    method: 'PATCH',
}

export const getAllUsers = {
    url: url + 'users/all',
    method: 'GET',
}

export const deleteUser = {
    url : url + 'users/deleteUser',
    method: 'DELETE'
}

export const updateUser = {
    url: url + 'users/updateUser',
    method: 'PUT',
}

//***************Article API's*******************

export const getAllArticle = {
    url: url + 'article',
    method: 'GET',
}

export const deleteArticle = {
    url : url + 'article',
    method: 'DELETE'
}

export const updateArticle = {
    url: url + 'article',
    method: 'PUT',
}

export const createArticle = {
    url: url + 'article',
    method: 'POST',
};