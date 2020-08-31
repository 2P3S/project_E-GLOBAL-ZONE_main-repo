import React, { useEffect, useRef, useState } from "react";
import List from "./List";
import useClick from "../../modules/hooks/useClick";

/**
 * TabView for Mobile
 * @returns {JSX.Element}
 * @constructor
 */
export default function TabView({ list }) {
	const [data, setData] = useState(list); // 스케줄 데이터 배열로 초기화
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
					setData(); // 클릭 된 탭에 따라서 스케줄 셋
				}
			}
		}
	};
	useEffect(() => {
		console.log(list);
	});
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
			<List tabView data={list}></List>
		</>
	);
}
