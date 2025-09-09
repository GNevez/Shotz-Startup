import { createSlice } from "@reduxjs/toolkit";

export const Slice = createSlice({
  name: "user",
  initialState: {
    name: "",
    id: "",
    avatar: "",
    isLogged: false,
  },
  reducers: {
    changeUser(state, action) {
      return {
        ...state,
        isLogged: true,
        name: action.payload.user,
        id: action.payload.id,
        avatar: action.payload.avatar,
      };
    },
    logout(state) {
      return { ...state, isLogged: false, name: "", id: "", avatar: "" };
    },
  },
});

export const { changeUser, logout } = Slice.actions;

export const selectUser = (state) => state.user;

export default Slice.reducer;
