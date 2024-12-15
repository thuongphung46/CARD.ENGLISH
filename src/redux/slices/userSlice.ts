import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@redux/store";

export interface IUserState {
  language: "en" | "vi";
  theme: "light" | "dark";
}

const initialState: IUserState = {
  language: "vi",
  theme: "light",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<Partial<IUserState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

// Actions
export const userActions = userSlice.actions;

// Selectors
export const userSelectors = (state: RootState) => state.user;

// Reducer
const userReducer = userSlice.reducer;
export default userReducer;
