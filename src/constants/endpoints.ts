const serverUrl = "http://192.168.1.102:3000/api";

export const httpTimeout = 5000;

export const endpoints = {
    googleUserInfo: serverUrl + "/auth/google-auth",
    registerUser: serverUrl + "/auth/register",
    loginUser: serverUrl + "/auth/login",
    userOtpVerify: serverUrl + "/auth/verify/user"
}