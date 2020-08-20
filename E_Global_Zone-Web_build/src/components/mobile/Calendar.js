import React from "react";

/**
 * Calendar <<추가예정>>
 * @returns {JSX.Element}
 * @constructor
 * @todo make Calendar
 */
export default function Calendar() {
	return (
		<div className="calandar">
			<a href="/reservation/1">
				<div
					style={{
						width: "100px",
						height: "100px",
						backgroundColor: "#000000",
						color: "#ffffff",
					}}
				>
					달력 컴포넌트
				</div>
			</a>
		</div>
	);
}
