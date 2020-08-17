import React from "react";
import Modal from "react-modal";

const modalStyle = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		zIndex: "2",
		overflow: "hidden",
	},
};
Modal.setAppElement(document.getElementById("modal-root"));
export default function MModal({ children, isOpen, handleClose }) {
	return (
		<Modal style={modalStyle} isOpen={isOpen} onRequestClose={handleClose}>
			{children}
		</Modal>
	);
}
