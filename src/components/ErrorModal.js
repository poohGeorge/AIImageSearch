// ErrorModal.js
import React from 'react';
import './Modal.css'; // Optional: for modal styling

const ErrorModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className='modal-text'>Error</h2>
                <p className='modal-text'>{message}</p>
                <button id='error-modal-btn' onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ErrorModal;
