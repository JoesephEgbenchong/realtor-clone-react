import React, { useState } from 'react'

export default function CreateListing() {
    const [formData, setFormData] = useState({
      type: "rent",
      parking: true,
      furnished: false,
      offer: true,
      regularPrice: 55,
      discountedPrice: 20,
    });

    const changeListingType = (event) => {
        //TODO
    }

    const changeParkingPreference = (event) => {
      //TODO
    }

    const changeFurnished = (event) => {
      //TODO
    }

    const changeOffer = (event) => {
      //TODO
    }

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;

      setFormData(values => ({...values, [name]: value}));
    }


  return (
    <main className="max-w-md px-2 mx-auto">
        <h1 className="text-3xl text-center font-bold mt-6">Create a Listing</h1>
        <form>
            <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
            <div className="w-full flex">
                <button type="button" name="type" value="sale" onClick={changeListingType} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.type === "sale" ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Sell
                </button>
                <button type="button" name="type" value="rent" onClick={changeListingType} 
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
                <p className="text-lg font-semibold">Beds</p>
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

          <p className="text-lg font-semibold">Parking Spot</p>
            <div className="w-full flex">
                <button type="button" name="parking" value={true} onClick={changeParkingPreference} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.parking ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Yes
                </button>
                <button type="button" name="parking" value={false} onClick={changeParkingPreference} 
                className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ !formData.parking ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    No
                </button>
            </div>

            <p className="mt-6 text-lg font-semibold">Furnished</p>
            <div className="w-full flex">
                <button type="button" name="furnished" value={true} onClick={changeFurnished} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.furnished ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Yes
                </button>
                <button type="button" name="furnished" value={false} onClick={changeFurnished} 
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
                <button type="button" name="offer" value={true} onClick={changeOffer} 
                className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-[90px]
                 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out
                  w-full ${ formData.offer ? "bg-green-500 text-white" : "bg-white text-black"}`}>
                    Yes
                </button>
                <button type="button" name="offer" value={false} onClick={changeOffer} 
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
