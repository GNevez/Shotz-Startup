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
    changeUser(state, payload) {
      return {
        ...state,
        isLogged: true,
        name: payload["payload"].user,
        id: payload["payload"].id,
        avatar: payload["payload"].avatar,
      };
    },
    logout(state) {
      return { ...state, isLogged: false, name: "", id: "" };
    },
  },
});

export const { changeUser, logout } = Slice.actions;

export const selectUser = (state) => state.user;

export default Slice.reducer;
