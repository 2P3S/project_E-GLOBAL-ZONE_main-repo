import React, {useEffect, useRef} from "react";

export default (onHover, onOut, Modal) => {
    if (typeof onHover !== "function" && typeof onOut !== "function") {
        return;
    }
    const element = useRef();
    useEffect(() => {
        if (element.current) {
            element.current.addEventListener("mouseover", onHover);
            element.current.addEventListener("mouseout", onOut);
            console.log(element);
        }
        return () => {
            if (element.current) {
                element.current.removeEventListener("mouseover", onHover);
                element.current.removeEventListener("mouseout", onOut);
            }
        };
    }, []);
    return element;
};
