// ProgressModal.js
import React from 'react';
import './Modal.css'; // Optional: for modal styling

const ProgressModal = ({ isOpen, onCancel }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2  className='modal-text'>Searching...</h2>
        <div className="loader"></div> {/* Add a loader animation */}
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ProgressModal;
