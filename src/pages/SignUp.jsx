import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { db } from '../firebase'
import { toast } from 'react-toastify';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';

export default function SignUp() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(values =>({...values, [name]: value}))
  }

  const togglePasswordView = () => {
    setShowPassword((prevState) => !prevState);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const auth =getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      updateProfile(auth.currentUser, {
        displayName: formData.fullName,
      });

      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
      toast.success("Sign Up was Successful");

    } catch (error) {
      toast.error("Something went wrong with the registration. Try again!");
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center font-bold mt-6">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7865.jpg?w=740&t=st=1678709678~exp=1678710278~hmac=a336ed1b66139af535ceeeccaea0364a68e59065ec43e5b68e3062c6488acb31" 
          alt="key" className="rounded-2xl w-full"/>
        </div>

        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form  onSubmit={handleSubmit}>
            <input className="w-full px-4 py-2 text-xl border-gray-300 bg-white text-gray-700 
            mb-6 transition duration-200 ease-in-out rounded-[90px]"
            type="text" name="fullName" id="fullName" 
            value={formData.fullName || ""} 
            onChange={handleChange} placeholder="Full Name" />

            <input className="w-full px-4 py-2 text-xl text-gray-700 rounded-[90px] bg-white 
            border-gray-300 transition ease-in-out mb-6" 
            type="email" name="email" 
            value={formData.email || ""} 
            onChange={handleChange} 
            placeholder="Email address"/>

            <div className="relative mb-6">
              <input className="w-full px-4 py-2 text-xl text-gray-700 rounded-[90px] bg-white 
              border-gray-300 transition ease-in-out" 
              type={showPassword ? "text" : "password" } name="password" 
              value={formData.password || ""} 
              onChange={handleChange} 
              placeholder="Password"/>
              {showPassword ? ( <AiFillEyeInvisible className="absolute right-3 top-3 text-xl cursor-pointer" onClick={togglePasswordView} /> 
              ) : ( 
              <AiFillEye className="absolute right-3 top-3 text-xl cursor-pointer" onClick={togglePasswordView}/> )}
            </div>

            <div className="flex mb-6 flex-wrap justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">Have an account ? <Link to="/sign-in" 
              className="text-red-600 hover:text-red-700 
              transition duration-200 ease-in-out ml-1">Sign In</Link></p>
              <p><Link to="/forgot-password" 
              className="text-blue-800 hover:text-blue-900 transition duration-200 ease-in-out">Forgot Password?</Link></p>
            </div>

            <button className="w-full bg-blue-600 text-white px-7 py-3 
            text-sm shadow-md rounded-[90px] uppercase font-medium 
            hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg 
            active:bg-blue-900" type="submit">Sign Up</button>
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
