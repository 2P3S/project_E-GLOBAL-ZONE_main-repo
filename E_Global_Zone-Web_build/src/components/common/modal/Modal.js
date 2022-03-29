import React, { useEffect } from "react";
import Modal from "react-modal";

const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.65)",
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		zIndex: "2",
		overflow: "visible",
		padding: "0",
		border: "none",
		borderRadius: "20px",
		background: "#fff url(/global/img/modalClose_bg.png) no-repeat right 0",
	},
};
Modal.setAppElement(document.getElementById("modal-root"));

/**
 * Modal from react-modal
 * @param children
 * @param isOpen
 * @param handleClose
 * @returns {JSX.Element}
 */
export default function ({ children, isOpen, handleClose, btn = true }) {
	return (
		<Modal style={modalStyle} isOpen={isOpen}>
			{btn && <div onClick={handleClose} className="modal_close" />}
			{children}
		</Modal>
	);
}
