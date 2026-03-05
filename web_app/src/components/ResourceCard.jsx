import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const ResourceCard = ({ resource }) => {
    return (
        <div className="glass rounded-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full border border-white/10 hover:border-brand-orange/50 shadow-xl">
            <Link to={`/resource/${resource.id}`} className="flex flex-col flex-grow">
                <div className="relative h-48 overflow-hidden bg-black/20">
                    {resource.courseImagePath ? (
                        <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${resource.courseImagePath}`} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-black/40">
                            No Image Available
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider">
                        {resource.platform}
                    </div>
                    {resource.price > 0 && (
                        <div className="absolute bottom-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            ₹{Number(resource.price).toLocaleString('en-IN')}
                        </div>
                    )}
                    {resource.price == 0 && (
                        <div className="absolute bottom-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            FREE
                        </div>
                    )}
                </div>

                <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white group-hover:text-brand-orange transition-colors">{resource.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{resource.description}</p>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 hover:text-brand-orange transition-colors cursor-pointer group/owner" onClick={(e) => { e.preventDefault(); window.location.href = `/user/${resource.owner?.id}`; }}>
                            {resource.owner?.profilePic ? (
                                <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${resource.owner.profilePic}`} alt="Owner" className="w-8 h-8 rounded-full object-cover border border-white/30 group-hover/owner:border-brand-orange transition-colors" />
                            ) : (
                                <FaUserCircle className="text-2xl text-gray-400 group-hover/owner:text-brand-orange transition-colors" />
                            )}
                            <span className="text-sm font-medium text-gray-300 group-hover/owner:text-brand-orange transition-colors">{resource.owner?.name || 'Unknown'}</span>
                        </div>

                        <span className="px-4 py-2 bg-white/5 group-hover:bg-brand-orange text-white text-sm font-medium rounded-lg transition-colors border border-white/10 group-hover:border-brand-orange">
                            View Details
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ResourceCard;
