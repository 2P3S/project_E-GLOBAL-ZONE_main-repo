import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice/userSlice";

export default configureStore({
	reducer: { user },
});
