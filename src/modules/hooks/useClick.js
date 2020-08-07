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
		}
		return () => {
			if (element.current) {
				element.current.removeEventListener("click", onClick);
			}
		};
	}, []);
	return element;
};
