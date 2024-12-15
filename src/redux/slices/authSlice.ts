import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@redux/store";
import { IUser } from "@/services/auth";
// import { RootState } from "redux/store";

// interface User {
//   id: string | number;
//   name: string;
// }
export interface LoginPayload {
  pin: string;
}
// Define a type for the slice state
export interface AuthState {
  isLoggedIn: boolean;
  isLoading?: boolean;
  currentUser?: IUser;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  currentUser: {
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    expirationDate: "",
    remainingBalance: 0,
    avatarBase64: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload | undefined>) {
      state.isLoading = true;
      state.isLoggedIn = false;
      state.currentUser = undefined;
    },
    loginSuccess(state, action: PayloadAction<IUser | undefined>) {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.currentUser = action.payload;
    },
    loginFailed(state, action: PayloadAction<string | undefined>) {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.currentUser = undefined;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.currentUser = undefined;
    },
    //set current user
    setCurrentUser(state, action: PayloadAction<IUser>) {
      state.currentUser = action.payload;
    },
  },
});

// Actions
export const authActions = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsLogging = (state: RootState) => state.auth.isLoading;

// Reducer
const authReducer = authSlice.reducer;
export default authReducer;
