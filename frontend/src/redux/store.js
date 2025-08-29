import { configureStore } from '@reduxjs/toolkit';

import userReducer from "./userSlice"
import lobbySlice from './lobbySlice';

export default configureStore({
    reducer: {
        user: userReducer,
        lobbys: lobbySlice,
    }
})