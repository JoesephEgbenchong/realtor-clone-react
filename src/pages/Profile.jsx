import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';
import ListingItem from '../components/ListingItem';

export default function Profile() {

  const [changeDetail, setChangeDetail] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchUserListings = async () =>{
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef","==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) =>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const editListing = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  }

  const deleteListing =  async (listingID) => {
    if(window.confirm("Confirm Listing delete ?")){
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !==listingID
      );
      setListings(updatedListings);
      toast.success("Listing Deleted");
    }
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
          </form>
          <button type='submit' className="w-full bg-blue-600 text-white uppercase font-medium  
          text-sm px-7 py-3 hover:bg-blue-700 transition duration-150 ease-in-out active:bg-blue-800 
          rounded-[90px] shadow-md hover:shadow-lg">
            <Link to="/create-listing" className="flex items-center justify-center">
                <FcHome className="mr-2 text-3xl bg-white rounded-full p-1 border-2"/>
                Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="mt-6 max-w-6xl px-3 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">My Listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 
             mt-6 mb-6">
              {listings.map((listing) =>(
                <ListingItem 
                key={listing.id} 
                id={listing.id} 
                listing={listing.data}
                onEdit={()=> editListing(listing.id)}
                onDelete={()=> deleteListing(listing.id)} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
