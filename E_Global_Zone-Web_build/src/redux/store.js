import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice/userSlice";
import conf from "./confSlice/confSlice";
import manager from "./managerSlice/managerSlice";

/**
 * ReduxStore
 */

export default configureStore({
	reducer: { user, conf, manager },
	devTools: process.env.REACT_APP_DEVELOP_MODE === "true" ? true : false,
});
