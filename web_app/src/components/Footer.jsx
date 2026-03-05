import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineLibraryBooks, MdEmail, MdPhone } from "react-icons/md";
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="glass mt-20 border-t border-white/10 pt-16 pb-8 px-6 transition-all duration-300 shadow-2xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                {/* Brand */}
                <div className="md:col-span-1">
                    <Link to="/" className="text-2xl font-bold tracking-wider text-brand-orange flex items-center gap-2 mb-4">
                        <MdOutlineLibraryBooks className="text-3xl" />
                        SkillHub
                    </Link>
                    <p className="text-gray-400 font-light leading-relaxed">
                        Empowering students across the globe by sharing valuable skills, resources, and connections to elevate the educational journey.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                    <ul className="space-y-3">
                        <li><Link to="/" className="text-gray-400 hover:text-brand-orange transition-colors">Home</Link></li>
                        <li><Link to="/search" className="text-gray-400 hover:text-brand-orange transition-colors">Discover Courses</Link></li>
                        <li><Link to="/about" className="text-gray-400 hover:text-brand-orange transition-colors">About Us</Link></li>
                        <li><Link to="/login" className="text-gray-400 hover:text-brand-orange transition-colors">Login / Register</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-gray-400">
                            <MdEmail className="text-brand-orange text-xl" /> support@skillhub.com
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <MdPhone className="text-brand-orange text-xl" /> +1 (555) 123-4567
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-orange hover:text-white transition-all">
                            <FaTwitter className="text-xl" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-orange hover:text-white transition-all">
                            <FaLinkedin className="text-xl" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-orange hover:text-white transition-all">
                            <FaGithub className="text-xl" />
                        </a>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center flex flex-col items-center">
                <p className="text-gray-400 text-sm mb-2">
                    &copy; {new Date().getFullYear()} SkillHub. All rights reserved.
                </p>
                <p className="text-brand-orange font-medium text-sm">
                    Developed by Nigam Chaudhary
                </p>
            </div>
        </footer>
    );
};

export default Footer;
