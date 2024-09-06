import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ModalWrapper = ({ toggle, setToggle, title, children, size = 'lg' }) => {
    const handleClose = () => setToggle(false);

    return (
        <Modal 
            show={toggle} 
            onHide={handleClose} 
            size={size} 
            aria-labelledby="contained-modal-title-vcenter" 
            centered 
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton className='my-2 py-2'>
                <Modal.Title className='fs-5 fw-bold'>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='my-auto d-block position-relative'>
                {children}</Modal.Body>
        </Modal>
    );
};

export default ModalWrapper;
