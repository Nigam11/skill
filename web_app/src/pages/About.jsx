import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto mb-20 animate-fade-in-up">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-white mb-6">
                    About <span className="text-brand-orange">SkillHub</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    A vibrant community built to empower students and professionals by sharing top-quality learning resources.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="glass p-8 rounded-2xl border-t-4 border-brand-orange hover:-translate-y-2 transition-transform duration-300">
                    <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                    <p className="text-gray-400 leading-relaxed">
                        To democratize education by creating a central repository where verified creators can share valuable courses, tutorials, and insights. We believe learning should be accessible, organized, and community-driven.
                    </p>
                </div>

                <div className="glass p-8 rounded-2xl border-t-4 border-yellow-500 hover:-translate-y-2 transition-transform duration-300">
                    <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                    <p className="text-gray-400 leading-relaxed">
                        We envision a world where anyone, anywhere, can find exactly what they need to master new skills. By bridging the gap between resource creators and eager learners, we foster global educational excellence.
                    </p>
                </div>
            </div>

            <div className="glass p-10 rounded-2xl text-center relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

                <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Join the Revolution</h2>
                <p className="text-gray-300 max-w-xl mx-auto mb-8 relative z-10">
                    Whether you're here to share your deep knowledge on Udemy or learn your first line of Java code, you have a place here.
                </p>

                <div className="flex justify-center gap-4 relative z-10">
                    <div className="px-6 py-4 bg-black/30 rounded-xl border border-white/10">
                        <div className="text-3xl font-bold text-brand-orange">10K+</div>
                        <div className="text-sm text-gray-400 font-medium">Active Learners</div>
                    </div>
                    <div className="px-6 py-4 bg-black/30 rounded-xl border border-white/10">
                        <div className="text-3xl font-bold text-blue-400">5K+</div>
                        <div className="text-sm text-gray-400 font-medium">Resources</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
