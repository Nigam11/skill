import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import { FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(query);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const platforms = ['udemy', 'coursera', 'edx', 'youtube'];
                const isPlatform = platforms.includes(query.toLowerCase());

                let res;
                if (isPlatform) {
                    res = await api.get(`/resources/filter/platform?platform=${encodeURIComponent(query)}`);
                } else {
                    res = await api.get(`/resources/search?title=${encodeURIComponent(query)}`);
                }
                setResources(res.data.data);
            } catch (error) {
                console.error("Error fetching search results", error);
            }
            setLoading(false);
        };

        if (query) {
            fetchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
            <Helmet>
                <title>{query ? `Search: ${query}` : 'Search Resources'} - SkillHub</title>
                <meta name="description" content={`Search and discover premium courses, skills, and resources matching "${query}" on SkillHub.`} />
            </Helmet>

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Search Results for <span className="text-brand-orange">"{query}"</span>
                </h1>

                <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                    </div>
                    <button type="submit" className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors font-medium">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                </div>
            ) : resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                    {resources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            ) : (
                <div className="glass p-12 text-center rounded-2xl animate-fade-in-up">
                    <p className="text-xl text-gray-400">No resources found matching your search.</p>
                    <button onClick={() => navigate('/')} className="mt-6 text-brand-orange hover:text-orange-400 transition-colors">
                        &larr; Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
