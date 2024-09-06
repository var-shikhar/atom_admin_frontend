import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FireToast } from './toastContext';

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [userID, setUserID] = useState(sessionStorage.getItem('userID') || '');
    const [userData, setUserData] = useState(JSON.parse(sessionStorage.getItem('userData')) || {});
    
    useEffect(() => {
        if (userID === '') {
            setUserData(null);
        } else {
            sessionStorage.setItem('userID', userID);
        }
    }, [userID]);

    useEffect(() => {
        if (userData) {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.removeItem('userData');
        }
    }, [userData]);


    const value = useMemo(
        () => ({
            userID,
            setUserID,
            userData,
            setUserData,
        }),
        [userID, userData],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        FireToast({ subTitle: 'Please login first!' });
    }
    return context;
};
