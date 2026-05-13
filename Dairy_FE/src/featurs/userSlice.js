import { createSlice } from "@reduxjs/toolkit"
import Cookies from 'js-cookie';


export const userSlice=createSlice({
    name:'user',
    initialState:[],
    reducers:{
        addUser(state,action){
            state.push(action.payload)
            Cookies.set('token',action.payload.access_token);
        },
        updateUser(state,action){
            while (state.length > 0) {
                state.pop();
            }
            state.push(action.payload)
            Cookies.set('token',action.payload.access_token);
        },
        deleteUser(state,action){
            while (state.length > 0) {
                state.pop();
            }
        },
    }
})
export const {addUser,updateUser,deleteUser}=userSlice.actions;