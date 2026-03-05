import React, { useState } from 'react';
import api from '../services/api';
import { FaTimes } from 'react-icons/fa';

const ShareResourceModal = ({ isOpen, onClose, onResourceAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [platform, setPlatform] = useState('Udemy');
    const [price, setPrice] = useState(0);
    const [courseLink, setCourseLink] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('platform', platform);
            formData.append('price', price);
            formData.append('courseLink', courseLink);
            if (image) {
                formData.append('courseImage', image);
            }

            const res = await api.post('/resources', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onResourceAdded(res.data.data);
            onClose();
        } catch (error) {
            console.error('Error sharing resource', error);
            alert(error.response?.data?.message || 'Error occurred while sharing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in-up">
            <div className="glass w-full max-w-2xl rounded-2xl relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors">
                    <FaTimes size={24} />
                </button>

                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                        Share a <span className="text-brand-orange">Resource</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-orange outline-none" placeholder="Course Title" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-orange outline-none">
                                    <option value="Udemy" className="bg-black text-white">Udemy</option>
                                    <option value="Coursera" className="bg-black text-white">Coursera</option>
                                    <option value="edX" className="bg-black text-white">edX</option>
                                    <option value="YouTube" className="bg-black text-white">YouTube</option>
                                    <option value="Other" className="bg-black text-white">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹) - 0 for Free</label>
                                <input type="number" step="0.01" min="0" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-orange outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Course URL</label>
                                <input type="url" required value={courseLink} onChange={e => setCourseLink(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-orange outline-none" placeholder="https://..." />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows="5" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-orange outline-none resize-none" placeholder="What is this course about?"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-orange-600 cursor-pointer" />
                                {image && <p className="mt-2 text-xs text-brand-orange/80">Selected: {image.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg bg-brand-orange text-white hover:bg-orange-600 transition-colors font-bold shadow-lg shadow-brand-orange/30 disabled:opacity-50 flex items-center gap-2">
                            {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full border-brand-orange"></span>}
                            Share Resource
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareResourceModal;
