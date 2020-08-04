import React from "react";
import { useParams } from "react-router-dom";

export default function Students() {
	const params = useParams();
	const valueOfParams = Object.entries(params)[0];
	console.log(valueOfParams);
	return (
		<div>
			{valueOfParams.map((v) => (
				<>{v}</>
			))}
		</div>
	);
}
