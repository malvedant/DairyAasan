import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./featurs/userSlice";

export const store =configureStore({
    reducer:{
        users:userSlice.reducer
    },
})