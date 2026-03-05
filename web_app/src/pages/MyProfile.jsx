import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../services/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import ShareResourceModal from '../components/ShareResourceModal';
import { FaUserCircle, FaEdit, FaTrash, FaPlus, FaWhatsapp, FaInstagram, FaBookmark } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const MyProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [savedResources, setSavedResources] = useState([]);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user) {
                setResources(user.resources || []);
                try {
                    const savesRes = await api.get('/users/me/saves');
                    if (savesRes.data?.success) {
                        setSavedResources((savesRes.data?.data || []).map(save => save.resource));
                    }
                } catch (error) {
                    console.error("Error fetching saved resources", error);
                }
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [user]);

    const handleDeletePic = async () => {
        if (window.confirm('Are you sure you want to delete your profile picture?')) {
            try {
                const res = await api.delete('/users/me/profile-pic');
                alert('Profile picture deleted');
                const userRes = await api.get('/users/me');
                setUser(userRes.data.data);
            } catch (err) {
                console.error(err);
                alert('Error deleting profile pic');
            }
        }
    };

    const triggerDeleteResource = (id) => {
        setResourceToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteResource = async () => {
        if (resourceToDelete) {
            try {
                await api.delete(`/resources/${resourceToDelete}`);
                setResources((resources || []).filter(r => r.id !== resourceToDelete));
            } catch (err) {
                console.error(err);
                alert('Error deleting resource');
            }
            setShowDeleteModal(false);
            setResourceToDelete(null);
        }
    };

    const cancelDeleteResource = () => {
        setShowDeleteModal(false);
        setResourceToDelete(null);
    };

    const handleUnsaveResource = async (id) => {
        const previousSaved = [...(savedResources || [])];
        setSavedResources((savedResources || []).filter(r => r.id !== id));
        try {
            await api.post(`/interactions/${id}/save`);
            toast.success("Resource unsaved");
        } catch (err) {
            console.error(err);
            setSavedResources(previousSaved);
            toast.error("Failed to unsave resource");
        }
    };

    if (!user) {
        return <div className="min-h-screen pt-24 text-center text-white">Please login to view profile.</div>;
    }

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-12">
            <Helmet>
                <title>My Profile - SkillHub</title>
                <meta name="description" content="Manage your SkillHub profile, view your shared resources, and access your saved courses." />
            </Helmet>

            <div className="glass p-8 rounded-2xl mb-12 flex flex-col md:flex-row gap-8 items-start relative animate-fade-in-up">
                <div className="relative group shrink-0 mx-auto md:mx-0">
                    {user.profilePic ? (
                        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-brand-orange shadow-2xl">
                            <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${user.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={handleDeletePic} className="text-white text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full flex items-center gap-1">
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <FaUserCircle className="w-32 h-32 md:w-48 md:h-48 text-gray-500 border-4 border-gray-600 rounded-full bg-black/30" />
                    )}
                </div>

                <div className="flex-grow pt-4">
                    <div className="flex justify-between items-start mb-4 flex-col md:flex-row gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                            <p className="text-brand-orange text-lg">@{user.email.split('@')[0]}</p>
                        </div>
                        <button onClick={() => navigate('/edit-profile')} className="px-5 py-2 glass rounded-lg hover:border-brand-orange transition-colors flex items-center gap-2 font-medium">
                            <FaEdit /> Edit Profile
                        </button>
                    </div>

                    <p className="text-gray-300 mt-4 mb-6 leading-relaxed max-w-2xl">
                        {user.bio || "No bio added yet. Tell people about yourself!"}
                    </p>

                    <div className="flex gap-6 pt-4 border-t border-white/10">
                        {user.gender && <div className="text-gray-400"><span className="text-white">Gender:</span> {user.gender}</div>}

                        {user.whatsapp && (
                            <a href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300">
                                <FaWhatsapp size={20} /> <span className="hidden md:inline">{user.whatsapp}</span>
                            </a>
                        )}
                        {user.instagram && (
                            <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-400 hover:text-pink-300">
                                <FaInstagram size={20} /> <span className="hidden md:inline">{user.instagram}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-brand-orange rounded-full"></span>
                        My Shared Resources
                    </h2>
                    <button onClick={() => setIsShareModalOpen(true)} className="bg-brand-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 font-medium">
                        <FaPlus /> Share New
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                    </div>
                ) : resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resources.map(resource => (
                            <div key={resource.id} className="relative group">
                                <ResourceCard resource={{ ...resource, owner: user }} />
                                <div className="absolute top-3 right-3 md:left-3 md:right-auto flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => navigate(`/edit-resource/${resource.id}`)} className="bg-blue-500 hover:bg-blue-600 p-2.5 rounded-full text-white shadow-lg border border-white/10">
                                        <FaEdit size={16} />
                                    </button>
                                    <button onClick={() => triggerDeleteResource(resource.id)} className="bg-red-500 hover:bg-red-600 p-2.5 rounded-full text-white shadow-lg border border-white/10">
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass p-16 text-center rounded-2xl border-dashed border-2 border-white/20">
                        <p className="text-xl text-gray-400 mb-4">You haven't shared any resources yet.</p>
                        <button onClick={() => setIsShareModalOpen(true)} className="text-brand-orange font-medium hover:underline">
                            Be the first to share one in your community!
                        </button>
                    </div>
                )}
            </div>

            {/* Saved Resources Section */}
            <div className="animate-fade-in-up mt-16" style={{ animationDelay: '0.3s' }}>
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-brand-orange rounded-full"></span>
                        <FaBookmark className="text-brand-orange text-2xl" />
                        Saved Resources
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                    </div>
                ) : savedResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {savedResources.map(resource => (
                            <div key={resource.id} className="relative group">
                                <ResourceCard resource={resource} />
                                <div className="absolute top-3 right-3 md:left-3 md:right-auto flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => handleUnsaveResource(resource.id)} className="bg-black/50 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-bold text-sm shadow-lg border border-white/20 flex items-center gap-1">
                                        <FaBookmark size={12} className="text-brand-orange" /> Unsave
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass p-16 text-center rounded-2xl border-dashed border-2 border-white/20">
                        <p className="text-xl text-gray-400 mb-4">You haven't saved any resources yet.</p>
                        <button onClick={() => navigate('/search')} className="text-brand-orange font-medium hover:underline">
                            Explore courses to save for later!
                        </button>
                    </div>
                )}
            </div>

            <ShareResourceModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                onResourceAdded={(newRes) => setResources([...(resources || []), newRes])}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-md animate-fade-in-up">
                    <div className="bg-gradient-to-br from-brand-dark to-black border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaTrash className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Delete Resource</h3>
                        <p className="text-gray-400 mb-8">Do you want to delete this resource?</p>
                        <div className="flex gap-4">
                            <button onClick={cancelDeleteResource} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-sm">
                                Cancel
                            </button>
                            <button onClick={confirmDeleteResource} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/30 text-sm">
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;
