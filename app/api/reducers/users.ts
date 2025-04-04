import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for User and Expense
interface User {
  id?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  loginUser: User;
  userAttributes: any[];
  expensesCount?: number;
  totalExpenses?: number;
  students: any[];
  currentUser: User | null;
}

// Initial state with TypeScript
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: true,
  loginUser: {},
  userAttributes: [],
  students: [],
  currentUser: []
};

// Create slice with TypeScript
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsers: (state, action: PayloadAction<{ users: User[] }>) => {
      state.users = action.payload.users;
    },
    getLoginDetails: (state, action: PayloadAction<{ user: User }>) => {
      state.loginUser = action.payload.user;
    },
    isLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.isLoading = action.payload.loading;
    },
    logoutUser: (state) => {
      state.loginUser = {};
    },
    getAllUsers: (state, action: PayloadAction<{ users: User[] }>) => {
      state.users = action.payload.users;
    },
    getUserDetail: (state, action: PayloadAction<{ user: User }>) => {
      state.currentUser = action.payload;
    },
    uploadProfilePhoto: (state, action: PayloadAction<{ userId: string; photoUrl: string }>) => {
      console.log('action.payload', action.payload);
      if (state.currentUser) {
        state.currentUser.profilePhoto = action.payload.photoUrl;
      }
    }
  },
});

// Export actions & reducer
export const { getUsers, isLoading, getLoginDetails, logoutUser, getUserDetail, uploadProfilePhoto } =
  usersSlice.actions;
export default usersSlice.reducer;
