import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';
import { FaWhatsapp, FaLinkedin, FaUserCircle, FaExternalLinkAlt, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ResourceDetail = () => {
    const { id } = useParams();
    const [resource, setResource] = useState(null);
    const [ownerContacts, setOwnerContacts] = useState(null);
    const [loading, setLoading] = useState(true);

    // Interactions state
    const [stats, setStats] = useState({ totalLikes: 0, totalSaves: 0, totalRatings: 0, averageRating: 0 });
    const [userInteractions, setUserInteractions] = useState({ liked: false, saved: false, userRating: null });

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const res = await api.get(`/resources/${id}`);
                setResource(res.data.data);

                // Fetch owner details to get whatsapp and linkedin
                if (res.data.data.owner?.id) {
                    const ownerRes = await api.get(`/users/${res.data.data.owner.id}`);
                    setOwnerContacts({
                        whatsapp: ownerRes.data.data.whatsapp,
                        linkedin: ownerRes.data.data.linkedin
                    });
                }

                // Fetch interactions stats
                const statsRes = await api.get(`/interactions/${id}/stats`);
                if (statsRes.data.success) {
                    setStats({
                        totalLikes: statsRes.data.data.totalLikes,
                        totalSaves: statsRes.data.data.totalSaves,
                        totalRatings: statsRes.data.data.totalRatings,
                        averageRating: statsRes.data.data.averageRating
                    });
                    setUserInteractions(statsRes.data.data.userInteractions);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching resource details:', error);
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like this resource");
            return navigate('/login');
        }
        // Optimistic UI
        const wasLiked = userInteractions.liked;
        setUserInteractions(prev => ({ ...prev, liked: !wasLiked }));
        setStats(prev => ({ ...prev, totalLikes: prev.totalLikes + (wasLiked ? -1 : 1) }));

        try {
            await api.post(`/interactions/${id}/like`);
        } catch (error) {
            // Revert on failure
            setUserInteractions(prev => ({ ...prev, liked: wasLiked }));
            setStats(prev => ({ ...prev, totalLikes: prev.totalLikes + (wasLiked ? 1 : -1) }));
            toast.error("Failed to like resource");
        }
    };

    const handleSave = async () => {
        if (!user) {
            toast.error("Please login to save this resource");
            return navigate('/login');
        }
        // Optimistic UI
        const wasSaved = userInteractions.saved;
        setUserInteractions(prev => ({ ...prev, saved: !wasSaved }));
        setStats(prev => ({ ...prev, totalSaves: prev.totalSaves + (wasSaved ? -1 : 1) }));

        try {
            const res = await api.post(`/interactions/${id}/save`);
            toast.success(res.data.message);
        } catch (error) {
            // Revert on failure
            setUserInteractions(prev => ({ ...prev, saved: wasSaved }));
            setStats(prev => ({ ...prev, totalSaves: prev.totalSaves + (wasSaved ? 1 : -1) }));
            toast.error("Failed to save resource");
        }
    };

    const handleRate = async (score) => {
        if (!user) {
            toast.error("Please login to rate");
            return navigate('/login');
        }
        try {
            await api.post(`/interactions/${id}/rate`, { score });
            toast.success("Rating submitted successfully!");
            // Refresh stats to get new average
            const statsRes = await api.get(`/interactions/${id}/stats`);
            if (statsRes.data.success) {
                setStats({
                    totalLikes: statsRes.data.data.totalLikes,
                    totalSaves: statsRes.data.data.totalSaves,
                    totalRatings: statsRes.data.data.totalRatings,
                    averageRating: statsRes.data.data.averageRating
                });
                setUserInteractions(statsRes.data.data.userInteractions);
            }
        } catch (error) {
            toast.error("Failed to submit rating");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    if (!resource) {
        return <div className="min-h-screen flex justify-center items-center text-white">Resource not found.</div>;
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up border border-white/10">
                <div className="relative h-64 md:h-96 bg-black/40">
                    {resource.courseImagePath ? (
                        <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${resource.courseImagePath}`} alt={resource.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                    )}
                    <div className="absolute top-4 right-4 bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wider backdrop-blur-md">
                        {resource.platform}
                    </div>

                    {/* Stats overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 flex gap-6 text-white text-sm font-medium">
                        <span className="flex items-center gap-2"><FaHeart className="text-red-500" /> {stats.totalLikes} Likes</span>
                        <span className="flex items-center gap-2"><FaStar className="text-yellow-400" /> {stats.averageRating} ({stats.totalRatings})</span>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-2xl">{resource.title}</h1>
                        <div className="flex-shrink-0">
                            {resource.price > 0 ? (
                                <span className="bg-green-500 text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg shadow-green-500/30">
                                    ₹{Number(resource.price).toLocaleString('en-IN')}
                                </span>
                            ) : (
                                <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg shadow-blue-500/30">
                                    FREE
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{resource.description}</p>

                    {/* Interactive Action Bar */}
                    <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 mb-10">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${userInteractions.liked ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-black/20 text-gray-400 hover:bg-white/10 border border-white/5'}`}
                        >
                            {userInteractions.liked ? <FaHeart /> : <FaRegHeart />}
                            {userInteractions.liked ? 'Liked' : 'Like'}
                        </button>

                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${userInteractions.saved ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30' : 'bg-black/20 text-gray-400 hover:bg-white/10 border border-white/5'}`}
                        >
                            {userInteractions.saved ? <FaBookmark /> : <FaRegBookmark />}
                            {userInteractions.saved ? 'Unsave' : 'Save'}
                        </button>

                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-gray-400 text-sm mr-2 hidden sm:block">Rate this:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer transition-colors text-xl ${userInteractions.userRating >= star ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400/50'}`}
                                    onClick={() => handleRate(star)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-t border-white/10 pt-8 mt-8">
                        {/* Owner Connect Box */}
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-full md:w-auto">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${resource.owner?.id}`)}>
                                {resource.owner?.profilePic ? (
                                    <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${resource.owner.profilePic}`} alt="Owner" className="w-14 h-14 rounded-full object-cover border-2 border-brand-orange" />
                                ) : (
                                    <FaUserCircle className="text-5xl text-gray-400" />
                                )}
                                <div>
                                    <p className="text-sm text-gray-400">Shared by</p>
                                    <p className="text-lg font-bold text-white hover:text-brand-orange transition-colors">{resource.owner?.name}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 ml-4 pl-4 border-l border-white/10">
                                {ownerContacts?.whatsapp && (
                                    <a href={`https://wa.me/${ownerContacts.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full transition-transform hover:scale-110 shadow-lg shadow-green-600/30" title="Connect on WhatsApp">
                                        <FaWhatsapp className="text-xl" />
                                    </a>
                                )}
                                {ownerContacts?.linkedin && (
                                    <a href={ownerContacts.linkedin} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full transition-transform hover:scale-110 shadow-lg shadow-blue-600/30" title="Connect on LinkedIn">
                                        <FaLinkedin className="text-xl" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <a href={resource.courseLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-orange/20 transition-all hover:-translate-y-1">
                            Go to Course <FaExternalLinkAlt className="text-sm" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetail;
