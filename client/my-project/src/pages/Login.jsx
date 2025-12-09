import React, { useContext, useState } from 'react'
import { assets } from '../../assets/asssets.js'
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()
  const { backendurl, setIsLoggedIn, getUserData } = useContext(AppContent)

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendurl + '/api/auth/register', { name, email, password })
        if (data.success) {
          setIsLoggedIn(true)
          navigate('/')
        } else toast.error(data.message)
      } else {
        const { data } = await axios.post(backendurl + '/api/auth/login', { email, password })
        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-5 bg-gradient-to-br from-blue-200 to-purple-400">

      <img 
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-24 sm:w-32 cursor-pointer"
      />

      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-sm text-sm text-indigo-300">

        <h2 className="text-3xl text-white font-semibold text-center mb-2">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>

        <p className="text-md text-center mb-4 text-indigo-400">
          {state === 'Sign Up' ? 'Create a new account' : 'Login to your account'}
        </p>

        <form onSubmit={onSubmitHandler}>

          {state === 'Sign Up' && (
            <div className="flex items-center gap-3 w-full px-5 py-2.5 bg-[#333A5C] rounded-full mb-4">
              <img src={assets.person_icon} alt="" />
              <input 
                type="text" 
                placeholder="Full Name"
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required 
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          )}

          <div className="flex items-center gap-3 w-full px-5 py-2.5 bg-[#333A5C] rounded-full mb-4">
            <img src={assets.mail_icon} alt="" />
            <input 
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full px-5 py-2.5 bg-[#333A5C] rounded-full mb-3">
            <img src={assets.lock_icon} alt="" />
            <input 
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <p 
            onClick={() => navigate('/reset-password')}
            className="text-indigo-400 text-sm mb-4 cursor-pointer hover:text-indigo-300 transition"
          >
            Forgot Password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-800 text-white font-medium hover:opacity-90 transition">
            {state}
          </button>

        </form>

        {state === 'Sign Up' ? (
          <p className="text-center mt-4">
            Already have an account?
            <span 
              onClick={() => setState('Login')} 
              className="text-indigo-500 cursor-pointer underline ml-1"
            >Login</span>
          </p>
        ) : (
          <p className="text-center mt-4">
            Don't have an account?
            <span 
              onClick={() => setState('Sign Up')} 
              className="text-indigo-500 cursor-pointer underline ml-1"
            >Sign Up</span>
          </p>
        )}

      </div>

    </div>
  )
}

export default Login
