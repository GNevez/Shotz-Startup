// filepath: src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import lobbySlice from "./lobbySlice";
import storage from "redux-persist/lib/storage"; // localStorage
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  lobbys: lobbySlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
