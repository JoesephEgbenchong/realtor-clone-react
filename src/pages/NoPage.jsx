import React from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImage from "../assets/png/404image.png"

export default function NoPage() {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  }

  return (
    <section>
      <div className="flex mx-auto max-w-6xl px-12 items-center">
        <div className="w-full md:w-[67%] lg:w-[50%] lg:mr-5 mb-8">
          <p className="font-bold text-8xl uppercase text-slate-500">oops...</p>
          <p className="font-semibold text-lg text-gray-800 mt-4">
            We can't seem to find the page you are looking for!
          </p>
          <button className="mt-4 bg-blue-500 text-white w-[30%] px-5 py-3 text-sm 
           font-semibold uppercase cursor-pointer shadow-md hover:shadow-lg hover:bg-blue-700 
           transition duration-150 ease-in-out rounded-full active:bg-blue-900 active:shadow-xl"
           onClick={navigateToHome}>
            Back to Home
          </button>
        </div>
        <div className="md:w-[80%] lg:w-[50%] mt-4">
          <img src={notFoundImage} alt="404 image not found" className="w-full rounded-full bg-white" />
        </div>
      </div>
    </section>
  )
}
