import {createSlice} from "@reduxjs/toolkit";
import User from "conf/class/User";
import conf from "conf/conf";

/**
 * ReduxSlice - user
 * @type {Slice<{isLogin: boolean, user}, {setClass: reducers.setClass, logIn: reducers.logIn, logOut: reducers.logOut}, string>}
 */
export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLogin: true,
        user: {id: 1418547, userClass: conf.userClass.FOREIGNER, name: '사람이름'},
    },
    reducers: {
        logIn: (state) => {
            state.isLogin = true;
        },
        logOut: (state) => {
            state.isLogin = false;
        },
        setClass: (state, action) => {
            state.user = {id: action.payload[0], userClass: action.payload[1]};
            // state.user.userClass = action.payload;
        },
    },
});

export const {logIn, logOut, setClass} = userSlice.actions;

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
