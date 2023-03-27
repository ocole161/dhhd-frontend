import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import specialsReducer from "./features/specialsSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    specials: specialsReducer
  },
});