import { createSlice } from "@reduxjs/toolkit";

export const lobbySlice = createSlice({
    name: 'lobbys',
    initialState: {
        salasList: []
    },
    reducers: {
        changeLobby(state, action) {
            state.salasList = action.payload;
        }
    }
});

export const { changeLobby } = lobbySlice.actions;

export const selectLobbys = (state) => state.lobbys.salasList;

export default lobbySlice.reducer;
