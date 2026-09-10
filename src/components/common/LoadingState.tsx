import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-8 glass-panel rounded-sm space-y-6 animate-pulse border border-[#E6E3DD]">
      <div className="h-8 bg-[#ECEAE5] rounded-xs w-1/3 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 bg-white p-4 rounded-xs border border-[#E6E3DD]">
            <div className="h-64 bg-[#ECEAE5] rounded-xs" />
            <div className="h-4 bg-[#ECEAE5] rounded-xs w-3/4" />
            <div className="h-4 bg-[#ECEAE5] rounded-xs w-1/2" />
            <div className="h-8 bg-[#ECEAE5] rounded-xs" />
          </div>
        ))}
      </div>
    </div>
  );
};
