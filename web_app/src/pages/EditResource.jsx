import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import api from '../services/api';

const EditResource = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        platform: '',
        price: 0,
        courseLink: '',
    });

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const res = await api.get(`/resources/${id}`);
                const data = res.data.data;
                // Verify owner
                if (user && data.ownerId !== user.id) {
                    alert('Not authorized to edit this resource');
                    navigate('/');
                    return;
                }
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    platform: data.platform || 'Udemy',
                    price: data.price || 0,
                    courseLink: data.courseLink || ''
                });
            } catch (err) {
                console.error('Error fetching resource', err);
                alert('Resource not found');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchResource();
        }
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('platform', formData.platform);
            data.append('price', formData.price);
            data.append('courseLink', formData.courseLink);
            if (image) {
                data.append('courseImage', image);
            }

            await api.put(`/resources/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error updating resource', error);
            alert('Failed to update resource');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="glass p-8 md:p-12 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-yellow-500"></div>

                <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                    Edit <span className="text-brand-orange">Resource</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input type="text" required name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                                <select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all appearance-none">
                                    <option value="Udemy" className="bg-black">Udemy</option>
                                    <option value="Coursera" className="bg-black">Coursera</option>
                                    <option value="edX" className="bg-black">edX</option>
                                    <option value="YouTube" className="bg-black">YouTube</option>
                                    <option value="Other" className="bg-black">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                                <input type="number" step="0.01" min="0" required name="price" value={formData.price} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Course URL</label>
                                <input type="url" required name="courseLink" value={formData.courseLink} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Update Image</label>
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-orange-600 transition-colors cursor-pointer bg-black/10 rounded-xl p-2 border border-white/5" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea required name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none transition-all resize-none"></textarea>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-white/10 pt-8 mt-8">
                        <button type="button" onClick={() => navigate('/profile')} className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="px-8 py-3 rounded-xl bg-brand-orange hover:bg-orange-600 text-white transition-colors font-bold shadow-lg shadow-brand-orange/30 disabled:opacity-50 flex items-center justify-center min-w-[140px]">
                            {saving ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditResource;
