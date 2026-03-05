import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { MdOutlineLibraryBooks } from "react-icons/md";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.body.classList.add('light-theme');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
        setIsMobileMenuOpen(false); // Close menu if open
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        logout();
        toast.success("Successfully logged out!");
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 glass transition-all duration-300">
                <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                    <Link to="/" className="text-2xl font-bold tracking-wider text-brand-orange flex items-center gap-2 z-50">
                        <MdOutlineLibraryBooks className="text-3xl" />
                        SkillHub
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6 items-center">
                        <button
                            onClick={toggleTheme}
                            className="relative flex items-center justify-between w-16 h-8 bg-white/5 border border-white/10 rounded-full p-1 cursor-pointer transition-colors hover:bg-white/10 focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            <FaMoon className={`text-yellow-400 text-sm z-10 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${!isDarkMode ? 'translate-x-8' : ''}`}></div>
                            <FaSun className={`text-brand-orange text-sm z-10 transition-opacity duration-300 ${!isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                        </button>

                        <Link to="/" className="hover:text-brand-orange transition-colors font-medium">Home</Link>
                        <Link to="/about" className="hover:text-brand-orange transition-colors font-medium">About Us</Link>

                        {user ? (
                            <div className="relative ml-4 border-l border-white/20 pl-4">
                                <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center gap-2 hover:text-brand-orange transition-colors focus:outline-none">
                                    {user.profilePic ? (
                                        <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${user.profilePic}`} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-brand-orange" />
                                    ) : (
                                        <FaUserCircle className="text-2xl" />
                                    )}
                                    <span className="font-medium">{user.name}</span>
                                </button>

                                {/* Desktop Profile Dropdown */}
                                <div className={`absolute right-0 mt-4 w-40 rounded-xl ${isDarkMode ? 'bg-brand-dark border-white/10' : 'bg-white border-gray-100'} z-50 transition-all duration-200 ease-in-out border shadow-lg overflow-hidden origin-top-right ${isProfileDropdownOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0 pointer-events-none'}`}>
                                    <div className="flex flex-col p-2 gap-1">
                                        <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className={`text-sm font-medium ${isDarkMode ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors py-2.5 px-3 rounded-lg flex items-center gap-2`}>
                                            <FaUserCircle /> Profile
                                        </Link>
                                        <button onClick={() => { setIsProfileDropdownOpen(false); handleLogoutClick(); }} className={`text-sm font-medium text-red-500 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors py-2.5 px-3 w-full text-left rounded-lg flex items-center gap-2`}>
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4 ml-4 border-l border-white/20 pl-4">
                                <Link to="/login" className="px-5 py-2 rounded-lg border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-all font-medium">Login</Link>
                                <Link to="/register" className="px-5 py-2 rounded-lg bg-brand-orange text-white hover:bg-orange-600 transition-all shadow-lg shadow-brand-orange/30 font-medium">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden flex items-center gap-3 z-50">
                        <button
                            onClick={toggleTheme}
                            className="relative flex items-center justify-between w-14 h-7 bg-white/5 border border-white/10 rounded-full p-1 cursor-pointer transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <FaMoon className={`text-yellow-400 text-xs z-10 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                            <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${!isDarkMode ? 'translate-x-7' : ''}`}></div>
                            <FaSun className={`text-brand-orange text-xs z-10 transition-opacity duration-300 ${!isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                        </button>

                        {user && (
                            <Link to="/profile" className="flex items-center hover:text-brand-orange transition-colors" aria-label="Profile">
                                {user.profilePic ? (
                                    <img src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}${user.profilePic}`} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-brand-orange shadow-md" />
                                ) : (
                                    <FaUserCircle className="text-2xl text-gray-300 hover:text-brand-orange transition-colors" />
                                )}
                            </Link>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-2xl text-gray-300 hover:text-brand-orange transition-colors focus:outline-none relative z-50 ml-1"
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu (Compact) */}
                <div className={`md:hidden absolute top-full right-6 mt-2 w-48 rounded-xl ${isDarkMode ? 'bg-brand-dark border-white/10' : 'bg-white border-gray-200'} z-50 transition-all duration-200 ease-in-out border shadow-md overflow-hidden origin-top-right ${isMobileMenuOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0 pointer-events-none'}`}>
                    <div className="flex flex-col p-2 gap-1">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium ${isDarkMode ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors py-2.5 px-4 rounded-lg`}>Home</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium ${isDarkMode ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors py-2.5 px-4 rounded-lg`}>About Us</Link>

                        {user ? (
                            <button onClick={handleLogoutClick} className={`text-sm font-medium text-red-500 transition-colors flex items-center gap-2 py-2.5 px-4 w-full text-left rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2 mt-1 px-2 pb-2">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-2 rounded-lg border border-brand-orange text-brand-orange font-medium hover:bg-brand-orange hover:text-white transition-all text-xs">Login</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-2 rounded-lg bg-brand-orange text-white font-medium hover:bg-orange-600 transition-all shadow-md shadow-brand-orange/30 text-xs">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-md animate-fade-in-up">
                    <div className="bg-gradient-to-br from-brand-dark to-black border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaSignOutAlt className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Confirm Logout</h3>
                        <p className="text-gray-400 mb-8">Do you want to logout?</p>
                        <div className="flex gap-4">
                            <button onClick={cancelLogout} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-sm">
                                Cancel
                            </button>
                            <button onClick={confirmLogout} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/30 text-sm">
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
