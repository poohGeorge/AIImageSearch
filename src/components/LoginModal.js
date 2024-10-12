import React, { useState } from 'react';
import './Modal.css'; // Optional: for modal styling

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
        onClose(); // Close the modal after submitting
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className='modal-text'>Login</h2>
                <form autoComplete="off">
                    <div className='modal-input-container'>
                        <p className='modal-text'>Username:</p>
                        <input
                            type="text"
                            className='modal-input'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete='off'
                            autoFocus
                        />
                    </div>
                    <div className='modal-input-container'>
                        <p className='modal-text'>Password:</p>
                        <input
                            type="password"
                            className='modal-input'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='off'
                        />
                    </div>
                    <button id='login-button' type="submit" onClick={handleSubmit}>Login</button>
                    <button id='close-button' type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
