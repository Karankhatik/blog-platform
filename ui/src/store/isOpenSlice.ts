import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IsOpenState {
  isOpenTOC: boolean;
  isOpenChapterMenu: boolean;
  isOpenReadability: boolean;
  isOpenDashboardSidebar: boolean
}

const initialState: IsOpenState = {
  isOpenTOC: false,
  isOpenChapterMenu: false,
  isOpenReadability: false,
  isOpenDashboardSidebar: false
};

export const isOpenSlice = createSlice({
  name: "isOpen",
  initialState,
  reducers: {
    setIsOpenTOCState: (state, action: PayloadAction<boolean>) => {
      state.isOpenTOC = action.payload;      
    },
    setIsOpenChapterState: (state, action: PayloadAction<boolean>) => {    
      state.isOpenChapterMenu = action.payload;
    },
    setIsOpenReadabilityState: (state, action: PayloadAction<boolean>) => {
      state.isOpenReadability = action.payload;
    },
    setIsOpenDashboardSidebar:(state, action: PayloadAction<boolean>) => {
      state.isOpenDashboardSidebar = action.payload;
    },
  },
});

export const { setIsOpenTOCState, setIsOpenChapterState, setIsOpenDashboardSidebar, setIsOpenReadabilityState } = isOpenSlice.actions;
export const isOpenReducer = isOpenSlice.reducer;