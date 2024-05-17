import { createSlice } from "@reduxjs/toolkit"

const darkMode = createSlice({
  name: 'darkMode',
  initialState: 'lightMode',
  reducers:{
    darkModeChange(state){
      return state === 'lightMode' ? 'darkMode' : 'lightMode'
    }
  }
});


export const {darkModeChange} = darkMode.actions

export default darkMode.reducer