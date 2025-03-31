import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for User and Expense
interface User {
  id?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

interface Expense {
  id?: string;
  amount?: number;
  date?: string;
  metadata?: Record<string, any>;
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  expenses: Expense[];
  loginUser: User;
  userAttributes: any[];
  expensesCount?: number;
  totalExpenses?: number;
}

// Initial state with TypeScript
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: true,
  expenses: [],
  loginUser: {},
  userAttributes: [],
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
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.isLoading = action.payload.loading;
    },
    logoutUser: (state) => {
      state.loginUser = {};
    }
  },
});

// Export actions & reducer
export const { getUsers, setLoading, getLoginDetails, logoutUser } =
  usersSlice.actions;
export default usersSlice.reducer;
