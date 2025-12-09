import React, { useContext, useState } from 'react'
import { assets } from '../../assets/asssets'
import { useNavigate } from 'react-router-dom'
import AppContent from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const { backendurl } = useContext(AppContent)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(backendurl + '/api/auth/send-reset-otp', { email })
      data.success ? toast.success("OTP sent to email") : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(backendurl + '/api/auth/send-reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-200 to-purple-400">

      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-4 sm:left-20 top-5 w-24 sm:w-32 cursor-pointer"
      />

      {/* EMAIL FORM */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your registered email</p>

          <div className="mb-4 flex items-center gap-3 w-full px-4 py-3 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-4" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* OTP FORM */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Enter OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email</p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  className="w-10 h-12 sm:w-12 sm:h-12 bg-[#333A5C] text-white text-center text-lg sm:text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full">
            Verify OTP
          </button>
        </form>
      )}

      {/* NEW PASSWORD FORM */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>

          <div className="mb-4 flex items-center gap-3 w-full px-4 py-3 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-4" />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Enter new password"
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full">
            Change Password
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword
