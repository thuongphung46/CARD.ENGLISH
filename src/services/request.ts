import axios, {HttpStatusCode} from "axios";
import GlobalConstant, {KEY_VALUE} from "@constants/GlobalConstant";
import {APP_CONFIG} from "@constants/app_config";
import {MESSAGE_CODE} from "../interfaces/enum";
import {GlobalData} from "@constants/global_data";
import HRMStorage from "@/common/function";

const baseUrl = APP_CONFIG.API_URL;
const INVALID_TOKEN = [401, 403, 404, 405, 406, 407, 203];
const INVALID_API = [500];
const CANNOT_CONNECT_API: any = {
    message: "Không kết nối được hệ thống, vui lòng thử lại sau",
    msg_code: -1,
    content: null,
};
const INVALID_TOKEN_MSG: any = {
    message: "Phiên làm việc hết hạn",
    msg_code: -401,
    content: null,
};

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: GlobalData.REQUEST_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
    },
    transitional: { forcedJSONParsing: false },
});

const composeUri = (controller: string, action: string, obj: any) => {
    try {
        const arr = [];
        let controllerName = "";
        const actionName = action ? `/${action}` : "";
        if (controller !== "") {
            controllerName = "/" + controller;
        }
        if (obj === null || obj === undefined) {
            return controllerName + action;
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                arr.push(key + "=" + encodeURIComponent(obj[key]));
            }
        }
        const params = arr.length ? `? ${arr.join("&")}` : "";
        return controllerName + actionName + params;
    } catch (error) {
        throw error;
    }
};

const getResponseData = (response: any) => {
    const dataConvertToJson = JSON.parse(response.data);
    const data = {
        message: dataConvertToJson.message,
        msg_code: dataConvertToJson.code,
        content: dataConvertToJson.data || null,
    };
    return data;
};

interface RequestHandleParams {
    controller: string;
    action: string;
    params?: any;
    method: "post" | "get" | "delete" | "patch";
}

const requestHandle = async (data: RequestHandleParams) => {
    try {
        const {controller, action, params, method} = data;
        const jwt = GlobalConstant.TOKEN;
        const lang = HRMStorage.get(KEY_VALUE.LANGUAGE);
        const paramsUri = method === "get" ? params : {};
        const uri = composeUri(controller, action, paramsUri);
        const requestMethod = axiosInstance[method];
        const headerConfig = {
            mock: `${jwt}`,
            "accept-language": lang === "en" ? "en-US" : "vi-VN",
        };
        return await (method === "get" || method === "delete"
                ? requestMethod(uri, {
                    headers: headerConfig,
                })
                : requestMethod(uri, JSON.stringify(params), {
                    headers: headerConfig,
                })
        )
            .then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    // return response.data;
                    return getResponseData(response);
                } else if (INVALID_TOKEN.includes(response.status)) {
                    return INVALID_TOKEN_MSG;
                } else if (INVALID_API.includes(response.status)) {
                    return CANNOT_CONNECT_API;
                }
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.status === MESSAGE_CODE.Unauthorized
                ) {
                    return INVALID_TOKEN_MSG;
                } else {
                    return CANNOT_CONNECT_API;
                }
            });
    } catch (error) {
        throw error;
    }
};

export const Request = (controller: string) => {
    return {
        getAsync: async (action: string, params?: any): Promise<any> => {
            return requestHandle({action, controller, method: "get", params});
        },

        postAsync: async (action: string, params?: any): Promise<any> => {
            return requestHandle({action, controller, method: "post", params});
        },

        patchAsync: async (action: string, params?: any): Promise<any> => {
            return requestHandle({action, controller, method: "patch", params});
        },

        deleteAsync: async (action: string, params?: any): Promise<any> => {
            return requestHandle({action, controller, method: "delete", params});
        },
    };
};
