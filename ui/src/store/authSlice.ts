import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IAuthState {
  authState: boolean;
  accessToken?: string;
  refreshToken?: string;
  user: any;
  admin:any;
}

const initialState: IAuthState = {
  authState: false,
  accessToken: '',
  refreshToken:'',
  user: null,
  admin: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setAdmin: (state, action: PayloadAction<any>) => {
      state.admin = action.payload;
    }
  },
});

export const { setAuthState, setAccessToken, setRefreshToken, setUser, setAdmin } = authSlice.actions;
export const authReducer = authSlice.reducer;