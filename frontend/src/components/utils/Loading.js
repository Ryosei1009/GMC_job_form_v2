import React from 'react';

const Loading = ({ message = "読み込み中..." }) => {
  return (
    <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex justify-center items-center z-[999] animate-fade-in">
      <div className="card-elegant p-8 flex items-center space-x-4 animate-slide-up">
        <div className="relative">
          <div className="animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 h-8 w-8"></div>
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary-500/20"></div>
        </div>
        <span className="text-secondary-700 font-medium text-lg">{message}</span>
      </div>
    </div>
  );
};

export default Loading;