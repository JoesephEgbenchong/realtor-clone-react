import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react';
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';


export default function OAuth() {
  const navigate = useNavigate();

  const googleLink = async () => {
    
    try {

      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      //check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if(!docSnap.exists()){
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
      toast.success("Successful authorization with Google!")

    } catch (error) {

      toast.error("Could not authorize with Google");
      
    }
  }


  return (
    <button type="button" onClick={googleLink} className="flex items-center justify-center w-full bg-red-500 
    shadow-md px-7 py-3 text-white font-medium hover:bg-red-600 transition duration-150 ease-in-out
     active:bg-red-700 rounded-[90px] uppercase text-sm hover:shadow-lg">
        <FcGoogle className="mr-2 bg-white text-2xl rounded-full"/>
        Continue with Google
    </button>
  )
}
