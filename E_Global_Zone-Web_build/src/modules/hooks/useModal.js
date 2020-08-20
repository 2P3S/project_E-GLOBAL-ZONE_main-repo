import {useState} from 'react';

/**
 * Hooks - useModal for modal's open state
 * @returns {{isOpen: boolean, handleOpen: (function(): void), handleClose: (function(): void)}}
 */
const useModal = ()=>{
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    return {isOpen,  handleClose, handleOpen};
}


export default useModal;