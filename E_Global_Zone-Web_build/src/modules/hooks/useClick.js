/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

export default (onClick) => {
	if (typeof onClick !== "function") {
		return;
	}
	const element = useRef();
	useEffect(() => {
		if (element.current) {
			element.current.addEventListener("click", onClick);
			element.current.style.cursor = "pointer";
		}
		return () => {
			if (element.current) {
				element.current.removeEventListener("click", onClick);
			}
		};
	}, []);
	return element;
};
