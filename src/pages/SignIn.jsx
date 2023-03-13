import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignIn() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(values =>({...values, [name]: value}))
  }

  const togglePasswordView = () => {
    setShowPassword((prevState) => !prevState);
  }

  return (
    <section>
      <h1 className="text-3xl text-center font-bold mt-6">Sign In</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7863.jpg?w=740&t=st=1678707395~exp=1678707995~hmac=0efc17e7caac82a37948bb8a7260c823a13ac2d6526c6d58747b9e5c2445a880" 
          alt="key" className="rounded-2xl w-full"/>
        </div>

        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form  className=" ">
            <input className="w-full px-4 py-2 text-xl text-gray-700 rounded-[90px] bg-white 
            border-gray-300 transition ease-in-out mb-6" 
            type="email" name="email" 
            value={formData.email || ""} 
            onChange={handleChange} 
            placeholder="Email address"/>

            <div className="relative mb-6">
              <input className="w-full px-4 py-2 text-xl text-gray-700 rounded-[90px] bg-white 
              border-gray-300 transition ease-in-out" 
              type={showPassword ? "text" : "password"} name="password" 
              value={formData.password || ""} 
              onChange={handleChange} 
              placeholder="Password"/>
              {showPassword ? ( <AiFillEyeInvisible className="absolute right-3 top-3 text-xl cursor-pointer" onClick={togglePasswordView} /> 
              ) : ( 
              <AiFillEye className="absolute right-3 top-3 text-xl cursor-pointer" onClick={togglePasswordView}/> )}
            </div>

            <div className="flex mb-6 flex-wrap justify-between whitespace-nowrap text-sm ms:text-lg">
              <p className="mb-6">Don't have an account ? <Link to="/sign-up" 
              className="text-red-600 hover:text-red-700 
              transition duration-200 ease-in-out ml-1">Register</Link></p>
              <p><Link to="/forgot-password" 
              className="text-blue-800 hover:text-blue-900 transition duration-200 ease-in-out">Forgot Password?</Link></p>
            </div>

            <button className="w-full bg-blue-600 text-white px-7 py-3 
            text-sm shadow-md rounded-[90px] uppercase font-medium 
            hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg 
            active:bg-blue-900" type="submit">Sign In</button>
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
