import React from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectDate, setSelectDate } from "../../redux/confSlice/confSlice";
import parseDate from "../../modules/parseDate";

class Calendar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			month: moment(),
			selected: moment().startOf("day"),
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
					select={(day) => this.select(day)}
					selected={selected}
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
				<span class="num">{month.format("YYYY")}</span>
				{window.localStorage.getItem("global-zone-lang") === "kor" ? "년" : " -"}{" "}
				<span class="num">{month.format("M")}</span>
				{window.localStorage.getItem("global-zone-lang") === "kor" ? "월" : ""}
			</span>
		);
	}

	render() {
		return (
			<section className="calendar">
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
					{window.localStorage.getItem("global-zone-lang") === "kor"
						? "일"
						: window.localStorage.getItem("global-zone-lang") === "eng"
						? "SUN"
						: "日"}
				</span>
				<span className="day">
					{window.localStorage.getItem("global-zone-lang") === "kor"
						? "월"
						: window.localStorage.getItem("global-zone-lang") === "eng"
						? "MON"
						: "月"}
				</span>
				<span className="day">
					{window.localStorage.getItem("global-zone-lang") === "kor"
						? "화"
						: window.localStorage.getItem("global-zone-lang") === "eng"
						? "TUE"
						: "火"}
				</span>
				<span className="day">
					{window.localStorage.getItem("global-zone-lang") === "kor"
						? "수"
						: window.localStorage.getItem("global-zone-lang") === "eng"
						? "WED"
						: "水"}
				</span>
				<span className="day">
					{window.localStorage.getItem("global-zone-lang") === "kor"
						? "목"
						: window.localStorage.getItem("global-zone-lang") === "eng"
						? "THU"
						: "木"}
				</span>
				<span className="day">
					{window.localStorage.getItem("global-zone-lang") === "kor"
						? "금"
						: window.localStorage.getItem("global-zone-lang") === "eng"
						? "FRI"
						: "金"}
				</span>
				<span className="day">
					{window.localStorage.getItem("global-zone-lang") === "kor"
						? "토"
						: window.localStorage.getItem("global-zone-lang") === "eng"
						? "SAT"
						: "土"}
				</span>
			</div>
		);
	}
}

const Week = (props) => {
	const dispatch = useDispatch();
	let days = [];
	let { date } = props;

	const { month, selected, select } = props;

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

					dispatch(setSelectDate(moment(day.date._d, "YYYY-MM-DD").format("YYYY-MM-DD")));
				}}
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
				onClick={() => select(day)}
			>
				{number}
			</span>
		);
	}
}

export default Calendar;
