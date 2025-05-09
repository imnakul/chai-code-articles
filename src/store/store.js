import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userSlice from './userSlice';
import articleSlice from './articleSlice';

const persistConfig = {
   key: 'root',
   storage,
};

const rootReducer = combineReducers({
   user: userSlice,
   article: articleSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});

export const persistor = persistStore(store);