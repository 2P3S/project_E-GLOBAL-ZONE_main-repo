/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

/**
 * Hooks - useClick for onClick event
 * @param {callback} onClick - callback function
 * @returns {React.MutableRefObject<undefined>}
 */
export default function (onClick) {
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
}
