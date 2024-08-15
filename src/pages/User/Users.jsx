import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {value: {user: {}}},
    reducers:{
        login: (state, action) => {
            state.value = action.contents
        },
        logout: (state) => {
            state.value = {};
        }
    }
})

export const {login} = userSlice.actions;

export default userSlice.reducer;