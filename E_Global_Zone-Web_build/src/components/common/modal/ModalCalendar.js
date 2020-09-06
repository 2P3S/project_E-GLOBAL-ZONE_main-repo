import React, { useEffect } from "react";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { selectSelectDate, setSelectDate } from "../../../redux/confSlice/confSlice";
import parseDate from "../../../modules/parseDate";

class Calendar extends React.Component {
	constructor(props) {
		super(props);
		const { selectDate } = props;

		this.state = {
			month: moment(selectDate !== "YYYY-MM-DD" ? selectDate : Date.now()),
			selected: moment(selectDate !== "YYYY-MM-DD" ? selectDate : Date.now()).startOf("day"),
		};
		this.previous = this.previous.bind(this);
		this.next = this.next.bind(this);
	}

	previous() {
		const { month } = this.state;

		this.setState({
			month: month.subtract(1, "month"),
		});
	}

	next() {
		const { month } = this.state;

		this.setState({
			month: month.add(1, "month"),
		});
	}
	select(day) {
		this.setState({
			selected: day.date,
			month: day.date.clone(),
		});
	}

	renderWeeks() {
		let weeks = [];
		let done = false;
		let date = this.state.month
			.clone()
			.startOf("month")
			.add("w" - 1)
			.day("Sunday");
		let count = 0;
		let monthIndex = date.month();

		const { selected, month } = this.state;

		while (!done) {
			weeks.push(
				<Week
					key={date}
					date={date.clone()}
					month={month}
					selected={selected}
					handleClose={this.props.handleClose}
					setState={this.props.setState}
					isStartDate={this.props.isStartDate}
					select={(day) => this.select(day)}
				/>
			);

			date.add(1, "w");
			done = count++ > 2 && monthIndex !== date.month();
			monthIndex = date.month();
		}

		return weeks;
	}

	renderMonthLabel() {
		const { month } = this.state;

		return (
			<span className="month-label">
				<span className="num">{month.format("YYYY")}</span>년{" "}
				<span className="num">{month.format("M")}</span>월
			</span>
		);
	}

	render() {
		return (
			<section className="calendar modal">
				<header className="header">
					<div className="month-display row">
						<span onClick={this.previous} className="arrows prev">
							<img src="/global/img/calender_arrow_prev.gif" alt="지난 달" />
						</span>
						{this.renderMonthLabel()}
						<span onClick={this.next} className="arrows next">
							<img src="/global/img/calender_arrow_next.gif" alt="다음 달" />
						</span>
					</div>
					<DayNames />
				</header>
				{this.renderWeeks()}
			</section>
		);
	}
}

class DayNames extends React.Component {
	render() {
		return (
			<div className="row day-names">
				<span className="day" style={{ color: "red" }}>
					일
				</span>
				<span className="day">월</span>
				<span className="day">화</span>
				<span className="day">수</span>
				<span className="day">목</span>
				<span className="day">금</span>
				<span className="day">토</span>
			</div>
		);
	}
}

const Week = (props) => {
	const selectDate = useSelector(selectSelectDate);
	const dispatch = useDispatch();
	let days = [];
	let { date, isStartDate } = props;
	const { month, selected, select, handleClose } = props;
	if (isStartDate) {
		dispatch(setSelectDate(selected));
	}

	useEffect(() => {
		console.log(props);
		return () => {
			props.setState(moment(selected).format("YYYY-MM-DD"));
		};
	});

	for (var i = 0; i < 7; i++) {
		let day = {
			name: date.format("dd").substring(0, 1),
			number: date.date(),
			isCurrentMonth: date.month() === month.month(),
			isToday: date.isSame(new Date(), "day"),
			date: date,
		};
		days.push(
			<Day
				day={day}
				selected={selected}
				select={() => {
					select(day);
					console.log(day.date._d);
					dispatch(setSelectDate(parseDate(day.date._d)));
				}}
				handleClose={handleClose}
			/>
		);

		date = date.clone();
		date.add(1, "day");
	}

	return (
		<div className="row week" key={days[0]}>
			{days}
		</div>
	);
};

class Day extends React.Component {
	render() {
		const {
			day,
			day: { date, isCurrentMonth, isToday, number },
			select,
			selected,
			handleClose,
		} = this.props;

		return (
			<span
				key={date.toString()}
				className={
					"day" +
					(isToday ? " today" : "") +
					(isCurrentMonth ? "" : " different-month") +
					(date.isSame(selected) ? " selected" : "")
				}
				onClick={() => {
					select(day);
					this.props.handleClose();
				}}
			>
				{number}
			</span>
		);
	}
}

export default Calendar;
