import { MiddlewareAPI, Dispatch, AnyAction } from "redux";

import axiosInstance from "../axios";

// Define the action payload structure
interface ApiRequestPayload {
  url: string;
  method: "get" | "post" | "put" | "delete";
  params?: Record<string, any>;
  onSuccess?: string;
  onError?: string;
  dispatchType?: string;
  body?: Record<string, any>;
}

// Type-safe Redux middleware
const api =
  ({ dispatch }: MiddlewareAPI<Dispatch<AnyAction>, any>) =>
  (next: Dispatch) =>
  async (action: AnyAction) => {
    if (action.type !== "apiRequest") {
      return next(action);
    }

    const isLoading = (status: boolean) => {
      dispatch({
        type: "users/isLoading",
        payload: { loading: status },
      });
    };

    try {
      isLoading(true);

      const { url, method, params, dispatchType, body } =
        action.payload as ApiRequestPayload;

      const response = await axiosInstance(url, {
        params,
        method,
        data: body,
      });

      if (dispatchType === "saveUserDetails") {
        dispatch({
          type: "global/globalMessage",
          payload: {
            message: "Your account has been created! Please login.",
            type: "success",
          },
        });
      }
      if (dispatchType === "userLogin") {
        dispatch({
          type: "global/globalMessage",
          payload: {
            message: "",
            type: "",
          },
        });
        dispatch({
          type: "users/getLoginDetails",
          payload: {
            user: response?.data?.user,
          },
        });

        return { isLogin: true };
      }
      if (dispatchType === "getLoginDetails") {
        dispatch({
          type: "users/getLoginDetails",
          payload: {
            user: response?.data?.user,
          },
        });

        return { isAuth: true };
      }
      if (dispatchType === "userLogout") {
        dispatch({
          type: "global/globalMessage",
          payload: {
            message: "You are signed out!",
            type: "success",
          },
        });

        dispatch({
          type: "users/getLoginDetails",
          payload: {
            user: {},
          },
        });

        return { isLogout: true };
      }
    } catch (error: any) {
      dispatch({
        type: "global/globalMessage",
        payload: {
          message: error.response?.data?.message || "Something went wrong!",
          type: "danger",
        },
      });
    } finally {
      isLoading(false);
    }
  };

export default api;
