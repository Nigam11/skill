import React from 'react';

const ResourceSkeleton = () => {
    return (
        <div className="glass rounded-xl overflow-hidden flex flex-col h-[380px] w-full border border-white/5 animate-pulse min-w-[280px]">
            {/* Image Placeholder */}
            <div className="h-48 bg-white/10 w-full relative">
                <div className="absolute top-3 right-3 bg-white/20 h-6 w-16 rounded-full"></div>
            </div>

            {/* Content Placeholder */}
            <div className="p-5 flex-grow flex flex-col h-full bg-black/10">
                {/* Title */}
                <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
                {/* Description lines */}
                <div className="h-3 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-5/6 mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3 mb-6"></div>

                {/* Footer Section */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <div className="h-8 w-8 rounded-full bg-white/20"></div>
                        {/* Name */}
                        <div className="h-4 w-20 bg-white/10 rounded"></div>
                    </div>
                    {/* View Details Button */}
                    <div className="h-8 w-24 bg-white/20 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default ResourceSkeleton;
