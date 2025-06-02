import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { DToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    // Clear tokens from context and localStorage
    setAToken('');
    setDToken('');
    localStorage.removeItem('aToken');
    localStorage.removeItem('DToken');

    navigate('/');
  };

  // Determine user role based on tokens
  const userRole = aToken ? 'Admin' : DToken ? 'Doctor' : 'Guest';

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-sm'>
        <img
          className='cursor-pointer'
          src={assets.logo}
          alt='SPC Dental Clinic Logo'
        />
        <span className='text-2xl font-semibold text-red-600'>
          SPC Dental Clinic Panel
        </span>
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {userRole}
        </p>
      </div>
      <button
        onClick={logout}
        className='bg-primary text-white text-sm px-10 py-2 rounded-full'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
