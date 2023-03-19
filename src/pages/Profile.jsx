import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {

  const [changeDetail, setChangeDetail] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(values => ({...values,[name] : value}));
  }

  const handleSubmit = async () =>{

    try {
      if(auth.currentUser.displayName !== formData.name){
        //update displayName firebase auth first
        await updateProfile(auth.currentUser, {
          displayName: formData.name,
        });

        //update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: formData.name,
        });

        toast.success("Profile name updated!");
      }
    } catch (error) {
      toast.error("Could not update profile!");
    }
  }

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

            <input type="text" name="name" value={formData.name || ""} disabled={!changeDetail}
            className="mb-6 w-full text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 
            transition ease-in-out rounded-[90px] disabled:bg-slate-300" onChange={handleChange} />

            {/* Email Input */}

            <input type="email" name="email" value={formData.email || ""} disabled 
            className="mb-6 w-full text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 
            transition ease-in-out rounded-[90px] disabled:bg-slate-300" />
          </form>

          <div className="flex justify-between md:text-sm sm:text-lg whitespace-nowrap mb-6">
            <p className="flex items-center">Do you want to change your name?
              <span className="text-red-500 cursor-pointer
               hover:text-red-700 transition 
              ease-in-out duration-200 ml-1" 
              onClick={()=> {
                changeDetail && handleSubmit()
                setChangeDetail((prevState) => !prevState)
                }}>{changeDetail ? "Apply Changes" : "Click here"}</span></p>
            <p className="text-blue-600 hover:text-blue-800 cursor-pointer transition-all
             duration-200 ease-in-out" onClick={onLogout}>Sign out</p>
          </div>
        </div>
      </section>
    </>
  )
}
