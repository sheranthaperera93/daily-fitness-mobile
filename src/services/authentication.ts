import axios, { HttpStatusCode } from "axios";
import { endpoints, httpTimeout } from '../constants/endpoints';

const handleError = (error: any) => {
    return { status: "ERROR", data: error.message, attribute: "" };
}

export const googleUserInfo = async (accessToken: string, register: boolean) => {
    const payload ={
        accessToken,
        register
    }
    try {
        const { data } = await axios.post(endpoints.googleUserInfo, payload, { timeout: httpTimeout });
        if (data) return { status: "SUCCESS", data, attribute: "" };
        return { status: "ERROR", data: "Internal Service Error", attribute: "" };
    } catch (error: any) {
        return handleError(error.response.data);
    }
}

export const registerUser = async (email: string, firstname: string, lastname: string, password: string) => {
    const payload = {
        "email": email,
        "firstName": firstname,
        "lastName": lastname,
        "password": password
    };
    try {
        const { data } = await axios.post(endpoints.registerUser, payload, { timeout: httpTimeout });
        if (data) return { status: "SUCCESS", data, attribute: "" };
        return { status: "ERROR", data: "Internal Service Error", attribute: "" };
    } catch (error: any) {
        if (error.response.data.code === HttpStatusCode.BadRequest && error.response.data.message === "Account Unverified") {
            return { status: "UNVERIFIED", data: "", attribute: "" }
        }
        return handleError(error.response.data);
    }
}

export const verifyUser = async (userId: string, code: string) => {
    const payload = {
        code: code,
        user_id: userId
    }
    try {
        const { data } = await axios.post(endpoints.userOtpVerify, payload, { timeout: httpTimeout });
        if (data) return { status: "SUCCESS", data, attribute: "" };
        return { status: "ERROR", data: "Internal Service Error", attribute: "" };
    } catch (error: any) {
        return handleError(error.response.data);
    }
}

export const loginUser = async (email: string, password: string) => {
    const payload = {
        email,
        password
    }
    try {
        const { data } = await axios.post(endpoints.loginUser, payload, { timeout: httpTimeout });
        if (data) return { status: "SUCCESS", data, attribute: "" };
        return { status: "ERROR", data: "Internal Service Error", attribute: "" };
    } catch (error: any) {
        return handleError(error.response.data);
    }
}