import { createSlice } from "@reduxjs/toolkit";
import User from "../../conf/class/User";
import conf from "../../conf/conf";

const nakamura = 1231234;
const korean = 1321704;

/**
 * ReduxSlice - user
 * @type {Slice<{isLogin: boolean, user}, {setClass: reducers.setClass, logIn: reducers.logIn, logOut: reducers.logOut}, string>}
 */
/* Korean/ Foreigner / Manager */
export const userSlice = createSlice({
	name: "user",
	initialState: {
		// isLogin: window.localStorage.getItem("token") ? true : false,
		// user: {
		// 	id: window.localStorage.getItem("loginId")
		// 		? window.localStorage.getItem("loginId")
		// 		: "",
		// 	userClass: window.localStorage.getItem("userClass")
		// 		? window.localStorage.getItem("userClass")
		// 		: "",
		// 	name: window.localStorage.getItem("loginName")
		// 		? window.localStorage.getItem("loginName")
		// 		: "",
		// },
		isLogin: true,
		user: {
			id: "",
			userClass: conf.userClass.MANAGER,
			name: "이름이다",
		},
	},
	reducers: {
		logIn: (state) => {
			state.isLogin = true;
		},
		logOut: (state) => {
			state.isLogin = false;
		},
		setClass: (state, action) => {
			state.user = { ...state.user, id: action.payload[0], userClass: action.payload[1] };
		},
	},
});

//1231234 나카무라상
//1321704 한국인 테스트 계정

export const { logIn, logOut, setClass } = userSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectIsLogin = (state) => state.user.isLogin;
export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
