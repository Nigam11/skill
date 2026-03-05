import React, { useState, useContext } from 'react';
import { AuthContext } from '../services/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Successfully logged in!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="glass p-8 rounded-2xl w-full max-w-md animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    Welcome Back to <span className="text-brand-orange">SkillHub</span>
                </h2>

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
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="flex justify-end text-sm">
                        <Link to="/reset-password" className="text-brand-orange hover:text-orange-400 transition-colors">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-brand-orange/30">
                        Login
                    </button>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don't have an account? <Link to="/register" className="text-brand-orange hover:text-orange-400 font-medium">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
