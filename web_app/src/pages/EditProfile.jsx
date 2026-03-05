import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        gender: '',
        whatsapp: '',
        instagram: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                gender: user.gender || '',
                whatsapp: user.whatsapp || '',
                instagram: user.instagram || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('bio', formData.bio);
            data.append('gender', formData.gender);
            data.append('whatsapp', formData.whatsapp);
            data.append('instagram', formData.instagram);

            if (image) {
                data.append('profilePic', image);
            }

            const res = await api.put('/users/me', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data.data);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="pt-24 min-h-screen text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="glass p-8 md:p-12 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-yellow-500"></div>

                <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                    Edit <span className="text-brand-orange">Profile</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                                <input type="text" required name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all appearance-none">
                                    <option value="" className="bg-black">Select Gender</option>
                                    <option value="Male" className="bg-black">Male</option>
                                    <option value="Female" className="bg-black">Female</option>
                                    <option value="Other" className="bg-black">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-orange-600 transition-colors cursor-pointer bg-black/10 rounded-xl p-2 border border-white/5" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                                <input type="text" name="whatsapp" placeholder="+1234567890" value={formData.whatsapp} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram Handle</label>
                                <input type="text" name="instagram" placeholder="@username" value={formData.instagram} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                        <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all resize-none" placeholder="Tell us about your learning journey..."></textarea>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-white/10 pt-8 mt-8">
                        <button type="button" onClick={() => navigate('/profile')} className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-brand-orange hover:bg-orange-600 text-white transition-colors font-bold shadow-lg shadow-brand-orange/30 disabled:opacity-50 flex items-center justify-center min-w-[140px]">
                            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
