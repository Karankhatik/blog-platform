import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IAuthState {
  authState: boolean;
  user: any;
  
}

const initialState: IAuthState = {
  authState: false,
  user: null,  
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload;
    },
    
    setUser: (state, action: PayloadAction<any>) => {      
      state.user = action.payload;
    },
   
  },
});

export const { setAuthState, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;