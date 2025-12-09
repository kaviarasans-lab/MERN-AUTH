import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../../../assets/asssets'
import axios from 'axios'
import AppContent from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EmailVerify = () => {

  const navigate = useNavigate()
  axios.defaults.withCredentials = true;

  const { backendurl, isloggedin, userData, getUserData } = useContext(AppContent)

  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const otp = inputRefs.current.map(e => e.value).join('')
      const { data } = await axios.post(backendurl + '/api/auth/verify-account', { otp })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isloggedin && userData?.isAccoutnVerified) navigate('/')
  }, [isloggedin, userData])

  return (
    <div className="flex items-center justify-center min-h-screen px-5 bg-gradient-to-br from-blue-200 to-purple-400">

      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt=""  
        className="absolute left-5 sm:left-20 top-5 w-24 sm:w-32 cursor-pointer"
      />

      <form 
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-sm text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-2">
          Email Verification
        </h1>

        <p className="text-center mb-6 text-indigo-400">
          Enter the 6-digit code sent to your email
        </p>

        <div 
          className="flex justify-between mb-6"
          onPaste={handlePaste}
        >
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              maxLength="1"
              className="w-10 h-12 sm:w-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"
              ref={(el) => inputRefs.current[index] = el}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              type="text"
            />
          ))}
        </div>

        <button className="w-full py-3 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-700 hover:opacity-90 transition">
          Verify Email
        </button>
      </form>

    </div>
  )
}

export default EmailVerify
