import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 } from 'uuid';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {

    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    //geocage URL and API_KEY
    const URL = `https://api.opencagedata.com/geocode/v1/json`;
    const API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;

    const [formData, setFormData] = useState({
      type: "rent",
      parking: true,
      furnished: false,
      offer: true,
      regularPrice: 55,
      discountedPrice: 20,
      latitude: 14,
      longitude: 33,
      images: {}
    });

    const handleChange = (event) => {
      let boolean = null;
      
      if(event.target.value === "true"){
        boolean = true;
      }

      if(event.target.value === "false"){
        boolean = false;
      }

      if(event.target.files){
        setFormData((prevState) =>({...prevState, 
        images: event.target.files
      }))
      }

      if(!event.target.files){
        setFormData((prevState) => ({...prevState,
        [event.target.name]: boolean ?? event.target.value //ternary operator. If you can't understand, search.
      }))
      }
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);

      if(formData.discountedPrice >= formData.regularPrice){
        setLoading(false);
        toast.error("Discounted price has to be lesser than Regular Price");
        return;
      }

      if(formData.images.length > 6){
        setLoading(false);
        toast.error("Number of images cannot be greater than 6");
        return;
      }

      let geolocation = {};
      if(geoLocationEnabled){
        try {
          const response = await fetch(`${URL}?q=${formData.address}&key=${API_KEY}`);
          const data = await response.json();//convert data to json
          console.log(data);

          geolocation.lat = data.results[0]?.geometry.lat ?? 0;
          geolocation.lng = data.results[0]?.geometry.lng ?? 0;

          if(data.results.length === 0){
            setLoading(false);
            toast.error("Please enter a correct address");
            return;
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        geolocation.lat = formData.latitude;
        geolocation.lng = formData.longitude;
      }

      const imgUrls = await Promise.all(
        [...formData.images]
          .map((image) => storeImage(image)))
          .catch((error) => {
            setLoading(false);
            console.log(error);
            toast.error("Images not uploaded");
            return;
          });

      const formDataCopy = {...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formData.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing Created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);

    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) =>{
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${v4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        //proceed by registering three state observers during the upload period
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );

      })
    }

    if(loading){
      return <Spinner />;
    }

  return (
    <main className="max-w-md px-2 mx-auto">
        <h1 className="text-3xl text-center font-bold mt-6">Create a Listing</h1>
        <form onSubmit={handleSubmit}>
            <p className="text-lg mt-6 font-semibold">Sell or Rent ?</p>
            <div className="w-full flex">
                <button type="button" name="type" value="sale" onClick={handleChange} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.type === "sale" ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Sell
                </button>
                <button type="button" name="type" value="rent" onClick={handleChange} 
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.type === "rent" ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Rent
                </button>
            </div>

            <p className='text-lg font-semibold mt-6'>Name</p>
            <input 
            type="text" 
            name="name" 
            minLength="10" 
            maxLength="32" 
            required
            placeholder="Listing Name"
            value={formData.name || ""}
            onChange={handleChange} 
            className="w-full text-gray-700 px-4 py-2 text-xl rounded-full transition
             duration-150 ease-in-out border border-gray-300 focus:text-gray-800 focus:bg-white
             focus:border-slate-400 mb-6"/>

             <div className="flex space-x-6 mb-6">
              <div className=" ">
                <p className="text-lg font-semibold">Bedrooms</p>
                <input 
                type="number" 
                name="bedrooms" 
                id=""
                value={formData.bedrooms || ""}
                onChange={handleChange}
                required
                min="1"
                max="50"
                className="w-full text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 transition 
                duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600
                rounded-full text-center"  />
              </div>

              <div className=" ">
                <p className="text-lg font-semibold">Bathrooms</p>
                <input 
                type="number" 
                name="bathrooms" 
                id=""
                value={formData.bathrooms || ""}
                onChange={handleChange}
                required
                min="1"
                max="50"
                className="w-full text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 transition 
                duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600
                rounded-full text-center"  />
              </div>
             </div>

          <p className="text-lg font-semibold">Parking Spot?</p>
            <div className="w-full flex">
                <button type="button" name="parking" value={true} onClick={handleChange} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.parking ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Yes
                </button>
                <button type="button" name="parking" value={false} onClick={handleChange} 
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ !formData.parking ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    No
                </button>
            </div>

            <p className="mt-6 text-lg font-semibold">Furnished ?</p>
            <div className="w-full flex">
                <button type="button" name="furnished" value={true} onClick={handleChange} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.furnished ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Yes
                </button>
                <button type="button" name="furnished" value={false} onClick={handleChange} 
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ !formData.furnished ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    No
                </button>
            </div>

            <p className='text-lg font-semibold mt-6'>Address</p>
            <textarea 
            type="text" 
            name="address" 
            required
            placeholder="Address Here"
            value={formData.address || ""}
            onChange={handleChange} 
            className="w-full text-gray-700 px-4 py-2 text-xl rounded transition
             duration-150 ease-in-out border border-gray-300 focus:text-gray-800 focus:bg-white
             focus:border-slate-400"/>

             {!geoLocationEnabled && (
              <div className="flex space-x-6">
                <div className="w-full ">
                  <p className="mt-6 text-lg font-semibold">Latitude</p>
                  <input 
                  type="number" 
                  name="latitude"
                  min={-90}
                  max={90} 
                  id=""
                  value={formData.latitude || ""} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-center text-gray-700 bg-white 
                  rounded-[10px] px-4 py-2 focus:bg-white focus:text-gray-700 focus:border-slate-300 
                  transition duration-150 ease-in-out text-xl"/>
                </div>

                <div className=" w-full">
                  <p className="mt-6 text-lg font-semibold">Longitude</p>
                  <input 
                  type="number" 
                  name="longitude"
                  min={-90}
                  max={90} 
                  id=""
                  value={formData.longitude || ""} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-center text-gray-700 bg-white 
                  rounded-[10px] px-4 py-2 focus:bg-white focus:text-gray-700 focus:border-slate-300 
                  transition duration-150 ease-in-out text-xl"/>
                </div>
              </div>
             )}

            <p className='text-lg font-semibold mt-6'>Description</p>
            <textarea 
            type="text" 
            name="description" 
            required
            placeholder="Description"
            value={formData.description || ""}
            onChange={handleChange} 
            className="w-full text-gray-700 px-4 py-2 text-xl rounded transition
             duration-150 ease-in-out border border-gray-300 focus:text-gray-800 focus:bg-white
             focus:border-slate-400 mb-6"/>

            <p className="text-lg font-semibold">Offer</p>
            <div className="w-full flex mb-6">
                <button type="button" name="offer" value={true} onClick={handleChange} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.offer ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Yes
                </button>
                <button type="button" name="offer" value={false} onClick={handleChange} 
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ !formData.offer ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    No
                </button>
            </div>

            <div className="flex mb-6 items-center">
              <div className=" ">
                <p className="text-lg font-semibold">Regular Price</p>
                <div className="w-full flex items-center justify-center space-x-7">
                  <input 
                  type="number" 
                  name="regularPrice" 
                  id=""
                  value={formData.regularPrice || ""}
                  required
                  onChange={handleChange}
                  min="50"
                  max="400000000"
                  className="w-full text-xl text-gray-700 px-4 py-2 bg-white border border-gray-300
                  rounded-full transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                   focus:border-slate-600 text-center" />
                   {formData.type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                  </div>
                  )}
                </div>
              </div>
            </div>

            {formData.offer && (
              <div className="flex mb-6 items-center">
              <div className=" ">
                <p className="text-lg font-semibold">Discounted Price</p>
                <div className="w-full flex items-center justify-center space-x-7">
                  <input 
                  type="number" 
                  name="discountedPrice" 
                  id=""
                  value={formData.discountedPrice || ""}
                  required
                  onChange={handleChange}
                  min="50"
                  max="400000000"
                  className="w-full text-xl text-gray-700 px-4 py-2 bg-white border border-gray-300
                  rounded-full transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                   focus:border-slate-600 text-center" />
                   {formData.type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                  </div>
                  )}
                </div>
              </div>
            </div> 
            )}
        
          <div className="mb-6">
            <p className="text-lg font-semibold">Image</p>
            <p className="text-gray-600">The first image will be the cover (max 6)</p>
            <input 
            type="file" 
            name="images"
            id=""
            onChange={handleChange}
            accept=" .jpg, .png, .jpeg" 
            multiple
            required
            className="w-full bg-white border border-gray-300 text-gray-700 text-xl px-3 py-1.5
             rounded transition duration-150 ease-in-out focus:border-slate-300 focus:bg-white"/>
          </div>

          <button type="submit" 
          className="mb-6 w-full bg-blue-600 text-white px-7 py-3 shadow-md text-sm
           uppercase rounded-full font-medium hover:bg-blue-700 hover:shadow-lg active:bg-blue-800
          focus:bg-blue-700 focus:shadow-lg active:shadow-lg transition duration-200 
          ease-in-out">Create Listing</button>
        </form>
    </main>
  )
}
