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

      const { url, method, params, dispatchType, body, onSuccess } =
        action.payload as ApiRequestPayload;

      const response = await axiosInstance(url, {
        params,
        method,
        data: body,
      });

      if(dispatchType === 'addNewUserModal') {
        return { isUserAdd: response?.data?.user };
      }
      if (dispatchType === "saveUserDetails") {
        dispatch({
          type: "global/globalMessage",
          payload: {
            message: "Your account has been created! Please login.",
            type: "success",
          },
        });
        dispatch({
          type: "users/getLoginDetails",
          payload: {
            user: response?.data?.user,
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
        return { isAuth: true, isUser: response?.data?.user };
      }
      if (dispatchType === "userLogout") {
        dispatch({
          type: "users/getLoginDetails",
          payload: {
            user: {},
          },
        });
        return { isLogout: true };
      }
      if(dispatchType === "getAllFeeDetails") {
        dispatch({
          type: "fee/getAllFeeDetails",
          payload: {
            feeAllDetails: response?.data,
          },
        });
        return true;
      }
      if(dispatchType === "getAllUsers") {
        console.log({response});
        dispatch({
          type: "users/getAllUsers",
          payload: {
            users: response?.data?.users
          },
        });
        return true;
      }
      if(dispatchType === "getAllStudents") {
        dispatch({
          type: "users/getAllStudents",
          payload: {
            students: response?.data.students
          },
        });
        return true;
      }
      if(dispatchType === "getStudentAttendance") {
        return {
          data: response?.data?.attendanceInfo
        }
      }
      if(dispatchType === "getUserDetail") {
        dispatch({
          type: "users/getUserDetail",
          payload: response?.data,
        });
        return true;
      }
      if(dispatchType === "uploadProfilePhoto") {
        dispatch({
          type: "users/uploadProfilePhoto",
          payload: response?.data,
        });
        return true;
      }
      if(dispatchType === "adminInfo") {
        dispatch({
          type: "users/adminInfo",
          payload: {
            userCounter: response?.data?.counter,
            branches: response?.data?.branches,
            permissions: response?.data?.permissions,
            roleTypes: response?.data?.adminRoles,
            classes: response?.data?.classes,
            subjects: response?.data?.subjects,
          }
        });
        return true;
      }
      if(dispatchType === "getClassTeachers") {
        dispatch({
          type: "users/getClassTeachers",
          payload: response?.data?.details
        });
        return true;
      }
      if(dispatchType === 'setClassTeachers') {
        return { isClassTeachersUpdate: true };
      }
    } catch (error: any) {
      if(error?.status !== 403) {
        dispatch({
          type: "global/globalMessage",
          payload: {
            message: error.response?.data?.message || "Something went wrong!",
            type: "danger",
          },
        });
      }
    } finally {
      isLoading(false);
    }
  };

export default api;
