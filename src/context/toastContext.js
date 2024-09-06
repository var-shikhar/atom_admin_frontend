import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

const ToastContext = createContext();
let fireToastFn = null; // Define fireToastFn globally

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ show: false, title: '', subTitle: '' });
    const [autoClose, setAutoClose] = useState(true);
    const [progress, setProgress] = useState(100); // Progress bar percentage
    const [startTime, setStartTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (toast.show && autoClose) {
            handleProgress();
            timerRef.current = setInterval(handleProgress, 100);

            return () => clearInterval(timerRef.current); // Clean up on unmount
        }

        return () => clearInterval(timerRef.current); // Clean up timer on change
        // Use toast.show instead of the entire toast object
    }, [toast, autoClose, elapsedTime, startTime]);

    function handleProgress() {
        const duration = 5000;

        const now = Date.now();
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
        const remaining = Math.max(0, duration - (elapsed + elapsedTime));
        setProgress((remaining / duration) * 100);

        if (remaining <= 0) {
            setToast(prevToast => ({ ...prevToast, show: false }));
        }
    }

    const fireToast = (title, subTitle) => {
        setToast({ show: true, title, subTitle });
        setStartTime(Date.now());
    };

    // Initialize fireToastFn with fireToast function
    useEffect(() => {
        fireToastFn = fireToast;
    }, []);

    const handleMouseEnter = () => {
        setAutoClose(false);
        clearInterval(timerRef.current);
    };

    const handleMouseLeave = () => {
        setAutoClose(true);
        setStartTime(Date.now() - elapsedTime); // Continue from where it left off
        timerRef.current = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, 5000 - (now - startTime));
            setProgress((remaining / 5000) * 100);
            if (remaining <= 0) {
                setToast({ ...toast, show: false });
            }
        }, 100);
    };

    return (
        <ToastContext.Provider value={{ fireToast }}>
            {children}
            <ToastContainer
                position="top-end"
                className="p-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} autohide={false}>
                    <Toast.Header>
                        <strong className="me-auto">{toast.title}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body className='bg-light'>{toast.subTitle}</Toast.Body>
                    <div className="toast-progress-bar">
                        <div
                            className="toast-progress"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </Toast>
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    fireToastFn = context.fireToast; // Assign the fireToast function
    return context;
};

export const FireToast = ({ title = "Notification", subTitle = 'Something went wrong, Try again!' }) => {
    if (fireToastFn) {
        fireToastFn(title, subTitle);
    } else {
        console.error('FireToast function called before initialization.');
    }
};
