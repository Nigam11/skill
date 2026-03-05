import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            // In a real app we don't show the token, but for this project requirement we do
            setMessage(`Demo Only: Your reset token is: ${res.data.token}. Go to Reset Password page.`);
        } catch (err) {
            setError(err.response?.data?.message || 'Error requesting password reset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="glass p-8 rounded-2xl w-full max-w-md animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-2 text-center text-white">
                    Forgot <span className="text-brand-orange">Password</span>
                </h2>
                <p className="text-gray-400 text-center mb-6 text-sm">Enter your email to receive a reset token</p>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">{error}</div>}
                {message && <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 break-all">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-all shadow-lg flex justify-center disabled:opacity-50">
                        {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Request Reset Token'}
                    </button>

                    <div className="flex justify-between items-center mt-6 text-sm">
                        <Link to="/login" className="text-gray-400 hover:text-white transition-colors">&larr; Back to Login</Link>
                        <Link to="/reset-password" className="text-brand-orange hover:text-orange-400 transition-colors">I have a token</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
