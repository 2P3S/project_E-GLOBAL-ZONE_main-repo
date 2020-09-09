import { createSlice } from "@reduxjs/toolkit";

export const managerSlice = createSlice({
	name: "manager",
	initialState: {
		currentStudent: "",
		data: "",
	},
	reducers: {
		setCurrentStudent: (state, action) => {
			state.currentStudent = action.payload;
		},
		setData: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { setCurrentStudent, setData } = managerSlice.actions;

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
export const selectCurrentStudent = (state) => state.manager.currentStudent;
export const selectData = (state) => state.manager.data;

export default managerSlice.reducer;
