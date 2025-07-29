import React from 'react';

export default function SloganBar({ phrases, index, fade }) {
  return (
    <div className={`text-white text-[10px] flex justify-end px-4 py-0.5 font-medium tracking-wide h-6 min-h-0 relative transition-all duration-300 bg-black bg-opacity-20 backdrop-blur-md  md:flex`}>
      <h1
        className={`text-white m-auto font-light tracking-wider absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        style={{ letterSpacing: "0.25em", fontSize: "10px" }}
      >
        {phrases[index]}
      </h1>
    </div>
  );
} 