import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

export default function ForgotPassword() {

  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(values =>({...values, [name]: value}))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, formData.email);

      toast.success("Email was sent!")

    } catch (error) {
      toast.error("Email could not be sent!")
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center font-bold mt-6">Forgot Password</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1010.jpg?w=740&t=st=1678711269~exp=1678711869~hmac=5a3db47751340adca3d99458d258d054486c0509af129c1b7c21d9e60c28e648" 
          alt="key" className="rounded-2xl w-full"/>
        </div>

        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleSubmit}>
            <input className="w-full px-4 py-2 text-xl text-gray-700 rounded-[90px] bg-white 
            border-gray-300 transition ease-in-out mb-6" 
            type="email" name="email" 
            value={formData.email || ""} 
            onChange={handleChange} 
            placeholder="Email address"/>

            <div className="flex mb-6 flex-wrap justify-between whitespace-nowrap text-sm ms:text-lg">
              <p className="mb-6">Don't have an account ? <Link to="/sign-up" 
              className="text-red-600 hover:text-red-700 
              transition duration-200 ease-in-out ml-1">Register</Link></p>
              <p><Link to="/sign-in" 
              className="text-blue-800 hover:text-blue-900 transition duration-200 ease-in-out">Sign in instead</Link></p>
            </div>

            <button className="w-full bg-blue-600 text-white px-7 py-3 
            text-sm shadow-md rounded-[90px] uppercase font-medium 
            hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg 
            active:bg-blue-900" type="submit">Reset Password</button>
            <div className="my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 
            after:border-b after:flex-1 after:border-gray-300">
              <p className="uppercase text-center font-semibold mx-4">Or</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  )
}
