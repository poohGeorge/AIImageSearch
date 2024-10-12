// Modal.js
import React from 'react';
import './Modal.css'; // Optional: for modal styling

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='modal-text'>Confirm Delete</h2>
        <p className='modal-text'>Are you sure you want to delete this item?</p>
        <div className="modal-actions">
          <button
            className='modal-delete'
            onClick={(e) => {
              e.preventDefault();  // Prevent passing the event to the handler
              onConfirm();
              }}
          >
            Delete
          </button>
          <button className='modal-cancel' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
