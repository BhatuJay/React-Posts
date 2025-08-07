import { createSlice } from '@reduxjs/toolkit';

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const initialState = {
  user: currentUser || null,
  isAuthenticated: !!currentUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
      sessionStorage.setItem("hasVisited", "true");
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("hasVisited");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;