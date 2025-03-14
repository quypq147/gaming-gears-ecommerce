'use client'

import React from 'react'
import Logo from './logo'

function Footer() {
  return (
    <footer className='bg-black text-white p-10'>
      <div className='flex flex-col md:flex-row justify-between items-center pb-5 mb-5 border-gray-500 border-b-2'>
        <div className='col-1 contact-ctn '>
          <h3 className='text-xl font-bold'>Contact us</h3>
          <p className='mt-2'><b>Email:</b> phanngocquy147@test.com </p>
          
          <p className='mt-2'><b>Phone:</b> 0123456789</p>
          <p className='mt-2'><b>Support time:</b> 08:30 - 21:30 everyday in week</p>
        </div>
      </div>
      <div className='flex flex-col md:flex-row justify-between items-center md:items-start'>
        <p className='mt-2'>@ GameSome's license.All rights reserved</p>
          <Logo />
        </div>
    </footer>
  )
}

export default Footer