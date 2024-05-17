import { createSlice } from "@reduxjs/toolkit";

const authData = createSlice({
    name: 'authData',
    initialState: {
        isLogin: false,
        user: null,
        interestedStocks: []
    },
    reducers: {
        login(state, action) {
            state.isLogin = true;
            state.user = action.payload.userData;
            state.interestedStocks = action.payload.interestedStocks;
        },
        logout(state) {
            state.isLogin = false;
            state.user = null;
            state.interestedStocks = [];
        },
        interestedStocksHandle(state, action) {
            state.interestedStocks = action.payload;
        }
    }
});

export const { login, logout, interestedStocksHandle } = authData.actions;
export default authData.reducer;