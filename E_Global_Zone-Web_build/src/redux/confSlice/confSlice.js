import { createSlice } from "@reduxjs/toolkit";
import parseDate from "../../modules/parseDate";
import moment from "moment";
/**
 * ReduxSlice - conf
 * @type {Slice<{dept: {}}, {setDept: reducers.setDept}, string>}
 */
export const confSlice = createSlice({
	name: "conf",
	initialState: {
		dept: {},
		today: moment(Date.now()).format("YYYY-MM-DD"),
		selectDate: moment(new Date(Date.now())).format("YYYY-MM-DD"),
	},
	reducers: {
		setDept: (state, action) => {
			let data = action.payload.data;
			if (typeof data === "object") {
				for (let index in data) {
					data[index].dept_name = data[index].dept_name.split("_");
				}
			}
			state.dept = data;
		},
		/**
		 * setSelectDate
		 * @param {Date} action.payload
		 */
		setSelectDate: (state, action) => {
			state.selectDate = action.payload;
		},

		setTodayToday: (state) => {
			state.today = parseDate(new Date(Date.now()));
		},
		setTodayFuture: (state) => {
			state.today = parseDate(new Date(Date.now() + 2));
		},
	},
});

export const { setDept, setSelectDate, setTodayFuture, setTodayToday } = confSlice.actions;

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
export const selectDept = (state) => state.conf.dept;
export const selectToday = (state) => state.conf.today;
export const selectSelectDate = (state) => state.conf.selectDate;

export default confSlice.reducer;
