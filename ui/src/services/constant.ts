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

//***************Course API's*******************

export const getAllCourse = {
    url: url + 'course',
    method: 'GET',
}

export const deleteCourse = {
    url : url + 'course',
    method: 'DELETE'
}

export const updateCourse = {
    url: url + 'course',
    method: 'PUT',
}

export const createCourse = {
    url: url + 'course',
    method: 'POST',
};

//***************Chapter API's*******************

export const getAllChapter = {
    url: url + 'chapters',
    method: 'GET',
}

export const deleteChapter = {
    url : url + 'chapters',
    method: 'DELETE'
}

export const updateChapter = {
    url: url + 'chapters',
    method: 'PUT',
}

export const createChapter = {
    url: url + 'chapters',
    method: 'POST',
};