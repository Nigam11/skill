import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await api.post('/auth/reset-password', { token, newPassword });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="glass p-8 rounded-2xl w-full max-w-md animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-2 text-center text-white">
                    Reset <span className="text-brand-orange">Password</span>
                </h2>
                <p className="text-gray-400 text-center mb-6 text-sm">Enter the token sent to your email</p>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">{error}</div>}
                {message && <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
                    {message}. Redirecting to login...
                </div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Reset Token</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter the reset token"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new strong password"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-all shadow-lg flex justify-center disabled:opacity-50">
                        {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Confirm Reset Password'}
                    </button>

                    <div className="flex justify-center mt-6 text-sm">
                        <Link to="/login" className="text-gray-400 hover:text-brand-orange transition-colors">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
