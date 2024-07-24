/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { UserAPI } from "../apis/UserAPI.js";

const AuthContext = createContext({});
AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const auth = localStorage.getItem('auth');
        console.log(auth);
        return auth !== 'undefined'? JSON.parse(auth) : null
    });

    useEffect(() => {
        if (auth)
            UserAPI.getSelf()
                .then(
                    user => { },
                    error => {
                        console.error(error);
                        if (error.response?.status === 401) {
                            setAuth(null);
                        }
                    }
                )
    }, []);

    useEffect(() => {
        if (!auth)
            localStorage.removeItem('auth');
        else {
            localStorage.setItem('auth', JSON.stringify(auth))
        }
    }, [ auth ]);

    return <AuthContext.Provider value={{auth, setAuth}}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext;