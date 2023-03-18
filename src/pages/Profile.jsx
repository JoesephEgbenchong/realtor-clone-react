import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-center mt-[25px]">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name Input */}

            <input type="text" name="name" value={formData.name} disabled 
            className="mb-6 w-full text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 
            transition ease-in-out rounded-[90px]" />

            {/* Email Input */}

            <input type="email" name="email" value={formData.email} disabled 
            className="mb-6 w-full text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 
            transition ease-in-out rounded-[90px]" />
          </form>

          <div className="flex justify-between md:text-sm sm:text-lg whitespace-nowrap mb-6">
            <p className="flex items-center">Do you want to change your name?
              <span className="text-red-500 cursor-pointer hover:text-red-700 transition 
              ease-in-out duration-200 ml-1">Edit</span></p>
            <p className="text-blue-600 hover:text-blue-800 cursor-pointer transition-all
             duration-200 ease-in-out" onClick={onLogout}>Sign out</p>
          </div>
        </div>
      </section>
    </>
  )
}
