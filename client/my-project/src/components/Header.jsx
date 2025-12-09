import React, { useContext } from 'react'
import { assets } from '../../../assets/asssets'
import { AppContent } from '../context/AppContext.jsx';

const Header = () => {

  const { userData } = useContext(AppContent);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">

      <img
        src={assets.header_img}
        alt=""
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full mb-6"
      />

      <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "Developer"}
        <img src={assets.hand_wave} className="w-7 sm:w-8 aspect-square" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
        Welcome to Our App
      </h2>

      <p className="max-w-md text-gray-700 mb-4">
        Let's start with a quick product tour and get you up and running in no time!
      </p>

      <button className="border border-gray-500 rounded-full px-6 sm:px-8 py-2.5 hover:bg-gray-200 cursor-pointer transition">
        Get Started
      </button>

    </div>
  );
};

export default Header;
