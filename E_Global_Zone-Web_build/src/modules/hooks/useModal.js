import {useState} from 'react';

const useModal = ()=>{
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    return {isOpen,  handleClose, handleOpen};
}


export default useModal;