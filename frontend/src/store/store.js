import { adminUser } from "./adminUserSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer: {
        adminUser,
    }
});

export default store;