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
  currentUser: User | null;
  userCounter: {},
  students: User[],
  permissionOptions: any[];
  branches: any[];
  roleTypes: any[];
  classes: any[];
  subjectsClasses: any[];
  classTeachers: any[];
}

// Initial state with TypeScript
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: true,
  loginUser: {},
  userAttributes: [],
  students: [],
  currentUser: [],
  userCounter: {},
  permissionOptions: [],
  branches: [],
  roleTypes: [],
  classes: [],
  subjectsClasses: [],
  classTeachers: []
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
    getAllStudents: (state, action: PayloadAction<{ students: User[] }>) => {
      state.students = action.payload.students;
    },
    getUserDetail: (state, action: PayloadAction<{ user: User }>) => {
      console.log('action.payload', action.payload);
      state.currentUser = action.payload;
    },
    uploadProfilePhoto: (state, action: PayloadAction<{ userId: string; photoUrl: string }>) => {
      if (state.currentUser) {
        state.currentUser.profilePhoto = action.payload.photoUrl;
      }
    },
    adminInfo: (state, action) => {
      state.userCounter = action.payload.userCounter;
      state.permissionOptions = action.payload.permissions;
      state.branches = action.payload.branches;
      state.roleTypes = action.payload.roleTypes;
      state.classes = action.payload.classes;
      state.subjectsClasses = action.payload.subjects;
    },
    getPermissions: (state, action) => {
      state.permissionOptions = action.payload;
    },
    getClassTeachers: (state, action) => {
      state.classTeachers = action.payload || []
    }
  },
});

// Export actions & reducer
export const { getUsers, isLoading, getLoginDetails, logoutUser, getUserDetail, uploadProfilePhoto, getAllStudents } =
  usersSlice.actions;
export default usersSlice.reducer;
