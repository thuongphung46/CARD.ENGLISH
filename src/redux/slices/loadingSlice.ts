import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@redux/store";

// Define a type for the slice state
export interface IloadingState {
  loading: boolean;
}

const initialState: IloadingState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    // showLoading
    showLoading(state) {
      state.loading = true;
    },
    // hideLoading
    hideLoading(state) {
      state.loading = false;
    },
  },
});

// Actions
export const loadingActions = loadingSlice.actions;

// Selectors
export const loading = (state: RootState) => state.loading;

// Reducer
const loadingReducer = loadingSlice.reducer;
export default loadingReducer;
