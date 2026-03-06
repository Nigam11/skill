import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import { FaUserCircle, FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${id}/profile`);
                setUser(res.data.data);
            } catch (error) {
                console.error("Error fetching user profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return <div className="min-h-screen pt-24 text-center text-brand-orange">Loading Profile...</div>;

    if (!user) return <div className="min-h-screen pt-24 text-center text-white">User not found.</div>;

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-12">
            <Helmet>
                <title>{user.name}'s Profile - SkillHub</title>
                <meta name="description" content={`View ${user.name}'s profile, shared resources, and connect on SkillHub.`} />
            </Helmet>

            <div className="glass p-8 rounded-2xl mb-12 flex flex-col md:flex-row gap-8 items-start relative animate-fade-in-up">
                <div className="shrink-0 mx-auto md:mx-0">
                    {user.profilePic ? (
                        <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${user.profilePic}`} alt="Profile" className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-brand-orange shadow-2xl" />
                    ) : (
                        <FaUserCircle className="w-32 h-32 md:w-48 md:h-48 text-gray-500 border-4 border-gray-600 rounded-full bg-black/30" />
                    )}
                </div>

                <div className="flex-grow pt-4">
                    <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                    <p className="text-brand-orange text-lg">@{user.email.split('@')[0]}</p>

                    <p className="text-gray-300 mt-4 mb-6 leading-relaxed max-w-2xl">
                        {user.bio || "This user hasn't added a bio yet."}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10 mt-6">
                        {user.gender && <div className="text-gray-400 bg-black/20 px-4 py-2 rounded-full border border-white/5"><span className="text-white">Gender:</span> {user.gender}</div>}

                        {user.instagram && (
                            <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-pink-600/20 text-pink-400 hover:bg-pink-600/40 px-4 py-2 rounded-full transition-colors border border-pink-500/20">
                                <FaInstagram size={20} /> <span>Instagram</span>
                            </a>
                        )}

                        {user.whatsapp && (
                            <a href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-green-600/20 font-medium">
                                <FaWhatsapp size={20} /> <span>Connect on WhatsApp</span>
                            </a>
                        )}

                        {user.linkedin && (
                            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-600/20 font-medium">
                                <FaLinkedin size={20} /> <span>Connect on LinkedIn</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-brand-orange rounded-full"></span>
                        Shared Resources
                    </h2>
                </div>

                {(user.resources || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(user.resources || []).map(resource => (
                            <ResourceCard key={resource.id} resource={{ ...resource, owner: user }} />
                        ))}
                    </div>
                ) : (
                    <div className="glass p-16 text-center rounded-2xl border-dashed border-2 border-white/20">
                        <p className="text-xl text-gray-400 mb-4">{user.name} hasn't shared any resources yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
