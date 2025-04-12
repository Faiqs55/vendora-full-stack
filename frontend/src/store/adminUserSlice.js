const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    user: null,
    isLoggedIn: false
}

const adminUserSlice = createSlice({
    name: "adminUser",
    initialState,
    reducers: {
        loginAdmin: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true
        },
        logoutAdmin: (state) => {
            state.user = null
            state.isLoggedIn = false
        }
    }
});


export const {loginAdmin, logoutAdmin} = adminUserSlice.actions;
export const adminUser = adminUserSlice.reducer;