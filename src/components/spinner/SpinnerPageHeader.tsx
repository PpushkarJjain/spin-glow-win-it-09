import React from 'react';

const SpinnerPageHeader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="text-white text-center">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold text-yellow-300 mb-2 drop-shadow-2xl">SPIN & WIN</h1>
        <p className="text-xl md:text-2xl text-yellow-200 font-poppins">GHOOMEGA WHEEL, MILEGA DEAL!</p>
      </div>
    </div>
  );
};

export default SpinnerPageHeader;
