import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import ResourceSkeleton from '../components/ResourceSkeleton';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [liveSuggestions, setLiveSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get('/resources/search');
                setResources(res.data?.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching resources", error);
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    // Debounced Live Search
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchQuery.trim()) {
                setLiveSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await api.get(`/resources/search?title=${encodeURIComponent(searchQuery)}`);
                setLiveSuggestions(res.data.data.slice(0, 5)); // Limit to 5 suggestions
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching live suggestions", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const javaCourses = (Array.isArray(resources) ? resources : []).filter(r => r.title.toLowerCase().includes('java') || r.description.toLowerCase().includes('java')).slice(0, 4);
    const udemyCourses = (Array.isArray(resources) ? resources : []).filter(r => r.platform.toLowerCase() === 'udemy').slice(0, 4);

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto animate-fade-in-up">
            <Helmet>
                <title>SkillHub - Share & Discover Premium Student Resources</title>
                <meta name="description" content="SkillHub empowers students to share premium courses, connect with peers, and elevate their educational journey through collaborative learning." />
            </Helmet>

            {user ? (
                <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-yellow-400">
                        Welcome back, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Ready to learn something new today?</p>
                </div>
            ) : (
                <div className="mb-12 text-center animate-fade-in-up md:pt-10" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white leading-tight">
                        Empowering Students Through <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-yellow-400">Skill & Resource Sharing</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Discover premium courses, share your knowledge, and connect with peers to elevate your educational journey.
                    </p>
                </div>
            )}

            {/* Search Bar */}
            <div className="glass p-4 rounded-2xl mb-12 shadow-lg max-w-2xl mx-auto shadow-brand-orange/5 animate-fade-in-up relative z-30" style={{ animationDelay: '0.2s' }}>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for courses, skills, or platforms (e.g. Udemy, Java)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder-gray-500"
                        />

                        {/* Live Dropdown */}
                        {showSuggestions && (Array.isArray(liveSuggestions) ? liveSuggestions : []).length > 0 && (
                            <div className="absolute top-full mt-2 w-full glass bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                                {isSearching ? (
                                    <div className="p-4 text-center text-gray-400 flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-brand-orange"></div>
                                        Loading...
                                    </div>
                                ) : (
                                    <ul className="max-h-64 overflow-y-auto">
                                        {(Array.isArray(liveSuggestions) ? liveSuggestions : []).map((item) => (
                                            <li key={item.id}
                                                className="px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-0 cursor-pointer transition-colors flex items-center gap-3"
                                                onClick={() => {
                                                    setShowSuggestions(false);
                                                    navigate(`/resource/${item.id}`);
                                                }}
                                            >
                                                <FaSearch className="text-gray-500 text-sm flex-shrink-0" />
                                                <div className="flex-grow min-w-0">
                                                    <p className="text-white font-medium truncate group-hover:text-brand-orange">{item.title}</p>
                                                    <p className="text-xs text-brand-orange uppercase tracking-wider">{item.platform}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {showSuggestions && !isSearching && (Array.isArray(liveSuggestions) ? liveSuggestions : []).length === 0 && searchQuery.trim() && (
                            <div className="absolute top-full mt-2 w-full glass bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl p-4 text-center text-gray-400 z-50">
                                No results found.
                            </div>
                        )}

                    </div>
                    <button type="submit" className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors font-medium z-10 relative">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <>
                    <div className="mb-12">
                        <div className="h-8 w-48 bg-white/10 rounded mb-6 animate-pulse"></div>
                        <div className="flex gap-6 overflow-hidden">
                            {[1, 2, 3, 4].map(n => <ResourceSkeleton key={n} />)}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Java Courses Section */}
                    <div className="mb-12 animate-fade-in-up relative group" style={{ animationDelay: '0.3s' }}>
                        <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-2">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-brand-orange rounded-full"></span>
                                Top Java Courses
                            </h2>
                            <button onClick={() => navigate('/search?q=java')} className="text-sm text-brand-orange hover:text-orange-400 font-medium transition-colors">See More &rarr;</button>
                        </div>

                        {javaCourses.length > 0 ? (
                            <div className="relative">
                                {/* Desktop Navigation Arrows */}
                                <button className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-brand-dark/80 backdrop-blur-md border border-white/10 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-orange shadow-xl hover:scale-110" aria-label="Scroll left" onClick={() => document.getElementById('slider-1').scrollBy({ left: -320, behavior: 'smooth' })}>
                                    <FaChevronLeft />
                                </button>

                                <div id="slider-1" className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                                    {javaCourses.map(resource => (
                                        <div key={resource.id} className="min-w-[85vw] md:min-w-[320px] max-w-[320px] snap-center shrink-0">
                                            <ResourceCard resource={resource} />
                                        </div>
                                    ))}
                                </div>

                                <button className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-brand-dark/80 backdrop-blur-md border border-white/10 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-orange shadow-xl hover:scale-110" aria-label="Scroll right" onClick={() => document.getElementById('slider-1').scrollBy({ left: 320, behavior: 'smooth' })}>
                                    <FaChevronRight />
                                </button>
                            </div>
                        ) : (
                            <div className="glass p-8 text-center text-gray-400 rounded-xl">No Java courses found yet.</div>
                        )}
                    </div>

                    {/* Udemy Courses Section */}
                    <div className="mb-12 animate-fade-in-up relative group" style={{ animationDelay: '0.4s' }}>
                        <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-2">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                Featured Udemy Courses
                            </h2>
                            <button onClick={() => navigate('/search?q=udemy')} className="text-sm text-brand-orange hover:text-orange-400 font-medium transition-colors">See More &rarr;</button>
                        </div>

                        {udemyCourses.length > 0 ? (
                            <div className="relative">
                                {/* Desktop Navigation Arrows */}
                                <button className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-brand-dark/80 backdrop-blur-md border border-white/10 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-orange shadow-xl hover:scale-110" aria-label="Scroll left" onClick={() => document.getElementById('slider-2').scrollBy({ left: -320, behavior: 'smooth' })}>
                                    <FaChevronLeft />
                                </button>

                                <div id="slider-2" className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                                    {udemyCourses.map(resource => (
                                        <div key={resource.id} className="min-w-[85vw] md:min-w-[320px] max-w-[320px] snap-center shrink-0">
                                            <ResourceCard resource={resource} />
                                        </div>
                                    ))}
                                </div>

                                <button className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-brand-dark/80 backdrop-blur-md border border-white/10 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-orange shadow-xl hover:scale-110" aria-label="Scroll right" onClick={() => document.getElementById('slider-2').scrollBy({ left: 320, behavior: 'smooth' })}>
                                    <FaChevronRight />
                                </button>
                            </div>
                        ) : (
                            <div className="glass p-8 text-center text-gray-400 rounded-xl">No Udemy courses found yet.</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
