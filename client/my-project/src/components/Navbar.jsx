import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../../../assets/asssets.js'
import { useNavigate } from 'react-router-dom'
import AppContent from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendurl, setUserData, setIsLoggedIn } = useContext(AppContent)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const logout = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendurl + '/api/auth/logout')
        data.success && setIsLoggedIn(false)
        data.success && setUserData(false)
        navigate('/')
      } catch (error) {
        toast.error(error.message)
      }
    }

    const sendverificationOtp = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendurl + '/api/auth/send-verify-otp')

        if (data.success) {
          navigate('/email-verify')
          toast.success(data.message)
        } else {
          toast.warning(data?.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    return (
      <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32' />

        {userData ?
          <div
            ref={dropdownRef}
            className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'
            onClick={() => setDropdownOpen(prev => !prev)}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {userData.name[0].toUpperCase()}
            <div className={`absolute w-50 top-0 right-0 z-10 text-black rounded pt-10 
              ${dropdownOpen ? 'block' : 'hidden sm:group-hover:block'}`}>
              <ul className='list-none m-0 p-2 bg-gray-200 text-sm'>
                {!userData.isAccoutnVerified && 
                  <li onClick={sendverificationOtp} className='py-1 px-2 hover:bg-gray-300 cursor-pointer'>
                    Verify Email
                  </li>
                }
                <li onClick={logout} className='py-1 px-2 hover:bg-gray-300 cursor-pointer'>
                  Logout
                </li>
              </ul>
            </div>
          </div> :

          <button onClick={() => navigate('/login')}
            className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer'>
            Login
            <img src={assets.arrow_icon} />
          </button>
        }
      </div>
    )
}

export default Navbar
