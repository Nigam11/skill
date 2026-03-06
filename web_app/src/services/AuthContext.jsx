import React, { createContext, useState, useEffect } from 'react';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/users/me');
                    setUser(res.data.data);
                } catch (error) {
                    console.error('Error fetching user', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });

        if (res.status === 200 && res.data?.success && res.data?.data?.token) {
            localStorage.setItem('token', res.data.data.token);
            const userRes = await api.get('/users/me');
            if (userRes.status === 200 && userRes.data?.success) {
                setUser(userRes.data.data);
                return true;
            }
        }
        throw new Error('Invalid response structure from server');
    };

    const register = async (name, email, password, whatsapp, linkedin) => {
        await api.post('/auth/register', { name, email, password, whatsapp, linkedin });
        // Don't auto login, force user to login page after registration modal
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
