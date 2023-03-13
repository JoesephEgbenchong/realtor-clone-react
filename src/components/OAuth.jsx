import React from 'react';
import { FcGoogle } from 'react-icons/fc'


export default function OAuth() {
  return (
    <button className="flex items-center justify-center w-full bg-red-500 
    shadow-md px-7 py-3 text-white font-medium hover:bg-red-600 transition duration-150 ease-in-out
     active:bg-red-700 rounded-[90px] uppercase text-sm hover:shadow-lg">
        <FcGoogle className="mr-2 bg-white text-2xl rounded-full"/>
        Continue with Google
    </button>
  )
}
