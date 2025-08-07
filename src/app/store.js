import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/counter/authSlice';
import postReducer from '../features/counter/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});