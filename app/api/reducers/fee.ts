import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for User and Expense
interface Fee {
  student_id?: string;
  fee_id?: string;
  amount_paid?: string;
  [key: string]: any;
}

interface UsersState {
  feeAllDetails: Fee[];
  isFeeDetailsLoading: boolean;
}

// Initial state with TypeScript
const initialState: UsersState = {
  feeAllDetails: [],
  isFeeDetailsLoading: true,
};

// Create slice with TypeScript
const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    getAllFeeDetails: (state, action: PayloadAction<{ feeAllDetails: Fee[]; }>) => {
      state.feeAllDetails = action.payload.feeAllDetails;
    },
    isFeeDetailsLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.isFeeDetailsLoading = action.payload.loading;
    }
  },
});

// Export actions & reducer
export const { isFeeDetailsLoading, getAllFeeDetails } = feeSlice.actions;
export default feeSlice.reducer;
