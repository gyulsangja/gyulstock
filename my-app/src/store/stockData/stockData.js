import { createSlice } from "@reduxjs/toolkit";

const stockData = createSlice({
    name: 'stockData',
    initialState: [],
    reducers: {
        storeDatas(state, action){
            return action.payload
        }
    }
})

export const {storeDatas} = stockData.actions
export default stockData.reducer