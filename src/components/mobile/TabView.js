import React, { useRef, useState } from "react";
import List from "./List";
import useClick from "modules/hooks/useClick";

export default function TabView() {
	const [data, setData] = useState([
		{
			language: "English",
			name: "이재원",
			time: ["시작시간", "종료시간"],
			status: "reserved",
		},
		{
			language: "Japanese",
			name: "이재원",
			time: ["시작시간", "종료시간"],
			status: "done",
		},
	]); // 스케줄 데이터 배열로 초기화
	const setClass = (e) => {
		for (const key in tabs) {
			if (tabs.hasOwnProperty(key)) {
				tabs[key].current.className = key;
			}
		}
		for (const key in tabs) {
			if (tabs.hasOwnProperty(key)) {
				const element = tabs[key];
				if (element.current === e.target) {
					element.current.className = "on";
					setData([
						{
							language: "Chinese",
							name: "이재원",
							time: ["시작시간", "종료시간"],
							status: "reserved",
						},
						{
							language: "Japanese",
							name: "이재원",
							time: ["시작시간", "종료시간"],
							status: "done",
						},
					]); // 클릭 된 탭에 따라서 스케줄 셋
				}
			}
		}
	};
	const tabView = useClick(setClass);
	const tabs = {
		all: useRef(),
		eng: useRef(),
		jp: useRef(),
		ch: useRef(),
	};
	return (
		<>
			<ul className="sch_tab" ref={tabView}>
				<li>
					<div ref={tabs.all} className="on">
						전체
					</div>
				</li>
				<li>
					<div ref={tabs.eng} className="eng">
						영어
					</div>
				</li>
				<li>
					<div ref={tabs.jp} className="jp">
						일본어
					</div>
				</li>
				<li>
					<div ref={tabs.ch} className="ch">
						중국어
					</div>
				</li>
			</ul>
			<List tabView data={data}></List>
		</>
	);
}
