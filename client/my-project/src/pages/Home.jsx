import React from 'react'
import { assets } from '../../../assets/asssets'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png") bg-center bg-cover]'>
    <Navbar/>
    <Header/>
    </div>
  )
}

export default Home
