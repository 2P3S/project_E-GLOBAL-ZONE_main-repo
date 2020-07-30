import { configureStore } from "@reduxjs/toolkit";
import login from "./loginSlice/loginSlice";

export default configureStore({
	reducer: { login },
});
