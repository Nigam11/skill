import React, { useState, useContext } from 'react';
import { AuthContext } from '../services/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, whatsapp, linkedin);
            toast.success('Account Created Successfully! Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className={`glass p-8 rounded-2xl w-full max-w-xl animate-fade-in-up transition-opacity duration-300`}>
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    Join <span className="text-brand-orange">SkillHub</span>
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input type="email" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input type="password" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp Number</label>
                        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+1234567890" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn Profile <span className="text-gray-500 text-xs">(Optional)</span></label>
                        <input type="url" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                    </div>

                    <button type="submit" className="md:col-span-2 w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-all transform active:scale-95 shadow-lg shadow-brand-orange/30">
                        Create Account
                    </button>

                    <p className="md:col-span-2 text-center text-gray-400 text-sm mt-4">
                        Already have an account? <Link to="/login" className="text-brand-orange hover:text-orange-400 font-medium">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
