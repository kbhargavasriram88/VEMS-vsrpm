import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col bg-darkBg text-white w-full animate-pulse min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[90vh] flex items-center pt-10 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start mt-10">
          <div className="h-4 w-48 bg-white/10 rounded mb-4"></div>
          <div className="h-20 w-3/4 max-w-2xl bg-white/10 rounded mb-6"></div>
          <div className="h-16 w-3/4 max-w-xl bg-white/10 rounded mb-10"></div>
          <div className="flex gap-4">
            <div className="h-12 w-48 bg-white/10 rounded"></div>
            <div className="h-12 w-48 bg-white/10 rounded"></div>
          </div>
        </div>
      </section>

      {/* Highlights Skeleton */}
      <section className="py-24 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="h-6 w-48 bg-white/10 rounded mb-12 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-darkCard p-8 border border-white/5 rounded-2xl">
                <div className="w-12 h-12 bg-white/10 rounded-lg mb-6"></div>
                <div className="h-6 w-3/4 bg-white/10 rounded mb-3"></div>
                <div className="h-16 w-full bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkeletonLoader;
