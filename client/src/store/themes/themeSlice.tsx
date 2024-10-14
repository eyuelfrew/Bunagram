// themeSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { ThemeState } from "../../types/Types";

const initialState: ThemeState = {
  darkMode: false, // Default theme
};
const themeReducer = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", state.darkMode);
    },
    initializeTheme(state) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        state.darkMode = savedTheme === "dark";
        document.documentElement.classList.toggle("dark", state.darkMode);
      }
    },
  },
});

// Export the actions and reducer
export const { toggleTheme, initializeTheme } = themeReducer.actions;
export default themeReducer.reducer;
