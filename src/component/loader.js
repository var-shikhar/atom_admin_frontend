import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useLoader } from '../context/loaderContext';

const Loader = () => {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div className={`loader-container ${loading && 'loading'}`}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <div className="loader-message">Loading...</div>
        </div>
    );
};

export default Loader;
