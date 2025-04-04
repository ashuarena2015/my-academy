import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeesState {
  feeAllDetails: {
    feeDetailsInfo: Array<any>;
    detailsType: string;
  };
  isFeeDetailsLoading: boolean  
}

// Initial state with TypeScript
const initialState: FeesState = {
  feeAllDetails: {
    feeDetailsInfo: [],
    detailsType: ""
  },
  isFeeDetailsLoading: true,
};

// Create slice with TypeScript
const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    getAllFeeDetails: (state, action: PayloadAction<{ feeAllDetails: { feeDetailsInfo: Array<any>; detailsType: string; }; }>) => {
      state.feeAllDetails = {
        feeDetailsInfo: action.payload.feeAllDetails.feeDetailsInfo,
        detailsType: action.payload.feeAllDetails.detailsType,
      };
    },
    isFeeDetailsLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.isFeeDetailsLoading = action.payload.loading;
    }
  },
});

// Export actions & reducer
export const { isFeeDetailsLoading, getAllFeeDetails } = feeSlice.actions;
export default feeSlice.reducer;
