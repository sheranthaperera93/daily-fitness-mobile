import axios from "axios";
import { endpoints } from '../constants/endpoints';

const handleError = (error: any) => {
    console.log("Internal Server Error", error);
    throw new Error("Internal Server Error");
}

export const googleUserInfo = async (accessToken: string) => {
    try {
        const { data } = await axios.post(endpoints.googleUserInfo, { "accessToken": accessToken });
        if(data) return data;
        return null;
    } catch (error) {
        handleError(error);
    }
};